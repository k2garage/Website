import type { IncomingMessage, ServerResponse } from "node:http";

export type ApiRequest = IncomingMessage & {
  method?: string;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string>;
};

export type ApiResponse = ServerResponse;

export function setJsonHeaders(res: ApiResponse, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
}

export function json<T>(res: ApiResponse, status: number, payload: T) {
  setJsonHeaders(res, status);
  res.end(JSON.stringify(payload));
}

export function noContent(res: ApiResponse) {
  res.statusCode = 204;
  res.end();
}

export function methodNotAllowed(res: ApiResponse, allowed: string[]) {
  res.setHeader("Allow", allowed.join(", "));
  json(res, 405, { error: "Nepovolená HTTP metoda." });
}

export function parseCookies(req: ApiRequest) {
  if (req.cookies) return req.cookies;
  const header = req.headers.cookie ?? "";
  return header.split(";").reduce<Record<string, string>>((cookies, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) cookies[key] = decodeURIComponent(rest.join("="));
    return cookies;
  }, {});
}

export async function readJsonBody<T extends Record<string, unknown> = Record<string, unknown>>(req: ApiRequest): Promise<T> {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body as T;
  if (typeof req.body === "string") return JSON.parse(req.body) as T;

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) as T : {} as T;
}

export function stringValue(value: unknown, maxLength = 1000) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function integerValue(value: unknown, fallback = 0) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : fallback;
}

export function booleanValue(value: unknown) {
  return value === true || value === "true" || value === 1 || value === "1";
}

export function clientIp(req: ApiRequest) {
  const forwarded = req.headers["x-forwarded-for"];
  return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress ?? "unknown";
}
