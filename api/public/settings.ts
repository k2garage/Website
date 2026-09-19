import type { ApiRequest, ApiResponse } from "../_lib/http";
import { json, methodNotAllowed } from "../_lib/http";
import { getSettings } from "../_lib/db";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try { const settings = await getSettings(); return settings ? json(res, 200, { data: settings }) : json(res, 404, { error: "Nastavení nebylo nalezeno." }); }
  catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : "Nastavení nelze načíst." }); }
}
