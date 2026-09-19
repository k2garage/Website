import type { ApiRequest, ApiResponse } from "../../../api/_lib/http";
import { json, methodNotAllowed } from "../../../api/_lib/http";
import { authIsConfigured, validSession } from "../../../api/_lib/auth";

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  return json(res, 200, { data: { configured: authIsConfigured(), authenticated: validSession(req) } });
}
