import type { ApiRequest, ApiResponse } from "../../../api/_lib/http";
import { json, methodNotAllowed } from "../../../api/_lib/http";
import { authIsConfigured, currentSession } from "../../../api/_lib/auth";

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const user = currentSession(req);
  return json(res, 200, { data: { configured: authIsConfigured(), authenticated: user !== null, user } });
}
