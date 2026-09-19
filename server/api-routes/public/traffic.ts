import type { ApiRequest, ApiResponse } from "../../../api/_lib/http";
import { clientIp, json, methodNotAllowed, readJsonBody, stringValue } from "../../../api/_lib/http";
import { recordTraffic } from "../../../api/_lib/db";
import { isRateLimited } from "../../../api/_lib/rateLimit";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  if (isRateLimited(`${clientIp(req)}:traffic`, 30, 24 * 60 * 60 * 1000)) return json(res, 204, {});
  try {
    const body = await readJsonBody<Record<string, unknown>>(req);
    const pathname = stringValue(body.pathname, 255) || "/";
    await recordTraffic(pathname.startsWith("/") ? pathname : "/");
  } catch {
    // Analytics is intentionally best-effort and must never disrupt page rendering.
  }
  return json(res, 200, { data: { recorded: true } });
}
