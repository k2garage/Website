import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { ApiRequest, ApiResponse } from "./http";
import { json, parseCookies } from "./http";

const COOKIE_NAME = "k2_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
export type AdminRole = "admin" | "owner";
export type SessionUser = { username: string; role: AdminRole };
const sessionSecret = () => process.env.ADMIN_SESSION_SECRET || "";

function base64Url(value: string | Buffer) { return Buffer.from(value).toString("base64url"); }
function signature(value: string) { const secret = sessionSecret(); return secret ? createHmac("sha256", secret).update(value).digest("base64url") : ""; }
function constantTimeEqual(first: string, second: string) { const a = Buffer.from(first); const b = Buffer.from(second); return a.length === b.length && timingSafeEqual(a, b); }
function credentials(role: AdminRole) {
  return role === "owner"
    ? { username: process.env.OWNER_USERNAME ?? "", password: process.env.OWNER_PASSWORD ?? "" }
    : { username: process.env.ADMIN_USERNAME ?? "", password: process.env.ADMIN_PASSWORD ?? "" };
}

export function authIsConfigured() {
  const admin = credentials("admin");
  const owner = credentials("owner");
  return Boolean(admin.username && admin.password && owner.username && owner.password && sessionSecret());
}

export function authenticate(username: string, password: string): SessionUser | null {
  for (const role of ["owner", "admin"] as const) {
    const expected = credentials(role);
    if (expected.username && expected.password && constantTimeEqual(username, expected.username) && constantTimeEqual(password, expected.password)) return { username, role };
  }
  return null;
}

export function createSession(user: SessionUser) {
  const payload = base64Url(JSON.stringify({ sub: user.username, role: user.role, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS, nonce: randomBytes(8).toString("hex") }));
  return `${payload}.${signature(payload)}`;
}

export function currentSession(req: ApiRequest): SessionUser | null {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token || !sessionSecret()) return null;
  const [payload, receivedSignature] = token.split(".");
  if (!payload || !receivedSignature || !constantTimeEqual(signature(payload), receivedSignature)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: unknown; role?: unknown; exp?: unknown };
    if (typeof parsed.sub !== "string" || (parsed.role !== "admin" && parsed.role !== "owner") || typeof parsed.exp !== "number" || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return { username: parsed.sub, role: parsed.role };
  } catch { return null; }
}

export function validSession(req: ApiRequest) { return currentSession(req) !== null; }
export function setSessionCookie(res: ApiResponse, session: string) { const secure = process.env.VERCEL || process.env.NODE_ENV === "production" ? "; Secure" : ""; res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(session)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`); }
export function clearSessionCookie(res: ApiResponse) { const secure = process.env.VERCEL || process.env.NODE_ENV === "production" ? "; Secure" : ""; res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`); }
export function requireAdmin(req: ApiRequest, res: ApiResponse) { if (validSession(req)) return true; json(res, 401, { error: "Přihlášení administrátora vypršelo nebo chybí." }); return false; }
