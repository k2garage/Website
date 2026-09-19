import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { ApiRequest, ApiResponse } from "./http";
import { json, parseCookies } from "./http";

const COOKIE_NAME = "k2_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const sessionSecret = () => process.env.ADMIN_SESSION_SECRET || "";

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function signature(value: string) {
  const secret = sessionSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function constantTimeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

export function authIsConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && sessionSecret());
}

export function credentialsAreValid(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  return Boolean(expectedUsername && expectedPassword && constantTimeEqual(username, expectedUsername) && constantTimeEqual(password, expectedPassword));
}

export function createSession(username: string) {
  const payload = base64Url(JSON.stringify({ sub: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS, nonce: randomBytes(8).toString("hex") }));
  return `${payload}.${signature(payload)}`;
}

export function validSession(req: ApiRequest) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token || !sessionSecret()) return false;
  const [payload, receivedSignature] = token.split(".");
  if (!payload || !receivedSignature || !constantTimeEqual(signature(payload), receivedSignature)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof parsed.exp === "number" && parsed.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function setSessionCookie(res: ApiResponse, session: string) {
  const secure = process.env.VERCEL || process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(session)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`);
}

export function clearSessionCookie(res: ApiResponse) {
  const secure = process.env.VERCEL || process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

export function requireAdmin(req: ApiRequest, res: ApiResponse) {
  if (validSession(req)) return true;
  json(res, 401, { error: "Přihlášení administrátora vypršelo nebo chybí." });
  return false;
}
