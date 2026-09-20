import type { IncomingMessage, ServerResponse } from "node:http";

type Request = IncomingMessage & { query?: Record<string, string | string[] | undefined>; cookies?: Record<string, string> };
type Response = ServerResponse;

function respond(res: Response, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(payload));
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return respond(res, 405, { error: "Nepovolená HTTP metoda." });
  }
  try {
    const { requireAdmin } = await import("../../api/_lib/auth");
    if (!requireAdmin(req, res)) return;
    const { getCars, getDashboard, getMessages, getPricing, getSettings } = await import("../../api/_lib/db");
    const [dashboard, messages, cars, pricing, settings] = await Promise.all([getDashboard(), getMessages(), getCars({ includeSold: true }), getPricing(), getSettings()]);
    return respond(res, 200, { data: { dashboard, messages, cars, pricing, settings } });
  } catch (error) {
    console.error("Admin bootstrap failure", error);
    return respond(res, 503, { error: error instanceof Error ? error.message : String(error) });
  }
}
