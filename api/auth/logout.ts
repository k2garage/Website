import type { ApiRequest, ApiResponse } from "../_lib/http";
import { clearSessionCookie } from "../_lib/auth";
import { json, methodNotAllowed } from "../_lib/http";

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  clearSessionCookie(res);
  return json(res, 200, { data: { loggedOut: true } });
}
