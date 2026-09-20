import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

type Request = IncomingMessage & { body?: unknown };
type Response = ServerResponse;
type Role = "admin" | "owner";

function same(first: string, second: string) {
  const a = Buffer.from(first);
  const b = Buffer.from(second);
  return a.length === b.length && timingSafeEqual(a, b);
}

function configured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.OWNER_USERNAME && process.env.OWNER_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

async function bodyOf(req: Request) {
  if (req.body && typeof req.body === "object") return req.body as Record<string, unknown>;
  if (typeof req.body === "string") return JSON.parse(req.body) as Record<string, unknown>;
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) as Record<string, unknown> : {};
}

function session(username: string, role: Role) {
  const payload = Buffer.from(JSON.stringify({ sub: username, role, exp: Math.floor(Date.now() / 1000) + 43200, nonce: randomBytes(8).toString("hex") })).toString("base64url");
  const signature = createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function respond(res: Response, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(payload));
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { error: "Nepovolená HTTP metoda." });
  }
  if (!configured()) return respond(res, 503, { error: "Přihlášení není nakonfigurováno." });
  try {
    const body = await bodyOf(req);
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const accounts: Array<{ role: Role; username: string; password: string }> = [
      { role: "owner", username: process.env.OWNER_USERNAME ?? "", password: process.env.OWNER_PASSWORD ?? "" },
      { role: "admin", username: process.env.ADMIN_USERNAME ?? "", password: process.env.ADMIN_PASSWORD ?? "" },
    ];
    const account = accounts.find((candidate) => same(username, candidate.username) && same(password, candidate.password));
    if (!account) return respond(res, 401, { error: "Nesprávné přihlašovací údaje." });
    res.setHeader("Set-Cookie", `k2_admin_session=${encodeURIComponent(session(account.username, account.role))}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`);
    return respond(res, 200, { data: { username: account.username, role: account.role } });
  } catch {
    return respond(res, 400, { error: "Neplatná data přihlášení." });
  }
}
