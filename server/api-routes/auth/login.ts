import type { ApiRequest, ApiResponse } from "../../../api/_lib/http";
import { json, methodNotAllowed, readJsonBody, stringValue } from "../../../api/_lib/http";
import { authIsConfigured, createSession, credentialsAreValid, setSessionCookie } from "../../../api/_lib/auth";
import { isRateLimited } from "../../../api/_lib/rateLimit";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  if (!authIsConfigured()) return json(res, 503, { error: "Přihlášení není nakonfigurováno. Doplňte ADMIN_USERNAME, ADMIN_PASSWORD a ADMIN_SESSION_SECRET." });
  if (isRateLimited(`${req.socket.remoteAddress ?? "unknown"}:login`, 8, 15 * 60 * 1000)) return json(res, 429, { error: "Příliš mnoho pokusů. Zkuste to prosím později." });

  try {
    const body = await readJsonBody(req);
    const username = stringValue(body.username, 100);
    const password = typeof body.password === "string" ? body.password : "";
    if (!credentialsAreValid(username, password)) return json(res, 401, { error: "Nesprávné přihlašovací údaje." });
    setSessionCookie(res, createSession(username));
    return json(res, 200, { data: { username } });
  } catch {
    return json(res, 400, { error: "Neplatná data přihlášení." });
  }
}
