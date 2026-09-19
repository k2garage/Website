import type { ApiRequest, ApiResponse } from "../../../api/_lib/http";
import { json, methodNotAllowed } from "../../../api/_lib/http";
import { getPricing } from "../../../api/_lib/db";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try { return json(res, 200, { data: await getPricing() }); }
  catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : "Ceník nelze načíst." }); }
}
