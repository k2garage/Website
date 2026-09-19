import type { ApiRequest, ApiResponse } from "../../_lib/http";
import { json, methodNotAllowed } from "../../_lib/http";
import { requireAdmin } from "../../_lib/auth";
import { getMessages } from "../../_lib/db";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  if (!requireAdmin(req, res)) return;
  try { return json(res, 200, { data: await getMessages() }); }
  catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : "Zprávy nelze načíst." }); }
}
