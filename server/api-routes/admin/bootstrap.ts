import type { ApiRequest, ApiResponse } from "../../../api/_lib/http";
import { json, methodNotAllowed } from "../../../api/_lib/http";
import { requireAdmin } from "../../../api/_lib/auth";
import { getCars, getDashboard, getMessages, getPricing, getSettings } from "../../../api/_lib/db";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  if (!requireAdmin(req, res)) return;
  try {
    const [dashboard, messages, cars, pricing, settings] = await Promise.all([getDashboard(), getMessages(), getCars({ includeSold: true }), getPricing(), getSettings()]);
    return json(res, 200, { data: { dashboard, messages, cars, pricing, settings } });
  } catch (error) {
    return json(res, 503, { error: error instanceof Error ? error.message : "Administrace není připravena." });
  }
}
