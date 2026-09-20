import { createHmac, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

type Request = IncomingMessage & { cookies?: Record<string, string> };
type Response = ServerResponse;

type SessionUser = { username: string; role: "admin" | "owner" };

function configured() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD &&
    process.env.OWNER_USERNAME &&
    process.env.OWNER_PASSWORD &&
    process.env.ADMIN_SESSION_SECRET,
  );
}

function cookieValue(req: Request, name: string) {
  const source = req.cookies?.[name] ?? req.headers.cookie ?? "";
  const entry = source.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : "";
}

function validSession(req: Request): SessionUser | null {
  const token = cookieValue(req, "k2_admin_session");
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!token || !secret) return null;
  const [payload, received] = token.split(".");
  if (!payload || !received) return null;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: unknown; role?: unknown; exp?: unknown };
    if (typeof parsed.sub !== "string" || (parsed.role !== "admin" && parsed.role !== "owner") || typeof parsed.exp !== "number" || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return { username: parsed.sub, role: parsed.role };
  } catch {
    return null;
  }
}

export default function handler(req: Request, res: Response) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ error: "Nepovolená HTTP metoda." }));
  }
  const user = validSession(req);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify({ data: { configured: configured(), authenticated: user !== null, user } }));
}
