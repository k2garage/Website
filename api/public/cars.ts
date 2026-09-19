import type { ApiRequest, ApiResponse } from "../_lib/http";
import { json, methodNotAllowed } from "../_lib/http";
import { getCars } from "../_lib/db";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try { return json(res, 200, { data: await getCars({ includeSold: false }) }); }
  catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : "Nabídku nelze načíst." }); }
}
