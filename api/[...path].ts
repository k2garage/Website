import type { ApiRequest, ApiResponse } from "./_lib/http";
import contactHandler from "../server/api-routes/contact";
import reservationHandler from "../server/api-routes/reservation";
import loginHandler from "../server/api-routes/auth/login";
import logoutHandler from "../server/api-routes/auth/logout";
import sessionHandler from "../server/api-routes/auth/session";
import publicCarsHandler from "../server/api-routes/public/cars";
import publicPricingHandler from "../server/api-routes/public/pricing";
import publicSettingsHandler from "../server/api-routes/public/settings";
import publicTrafficHandler from "../server/api-routes/public/traffic";
import adminBootstrapHandler from "../server/api-routes/admin/bootstrap";
import adminPricingHandler from "../server/api-routes/admin/pricing";
import adminSettingsHandler from "../server/api-routes/admin/settings";
import adminUploadHandler from "../server/api-routes/admin/upload";
import adminCarsHandler from "../server/api-routes/admin/cars/index";
import adminCarHandler from "../server/api-routes/admin/cars/[id]";
import adminMessagesHandler from "../server/api-routes/admin/messages/index";
import adminMessageHandler from "../server/api-routes/admin/messages/[id]";

function pathOf(req: ApiRequest) {
  return (req.url ?? "").split("?")[0].replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const path = pathOf(req);
  const query = { ...(req.query ?? {}) };
  const match = (prefix: string) => path === prefix || path.startsWith(`${prefix}/`);
  if (path === "/api/contact") return contactHandler(req, res);
  if (path === "/api/reservation") return reservationHandler(req, res);
  if (path === "/api/auth/login") return loginHandler(req, res);
  if (path === "/api/auth/logout") return logoutHandler(req, res);
  if (path === "/api/auth/session") return sessionHandler(req, res);
  if (path === "/api/public/cars") return publicCarsHandler(req, res);
  if (path === "/api/public/pricing") return publicPricingHandler(req, res);
  if (path === "/api/public/settings") return publicSettingsHandler(req, res);
  if (path === "/api/public/traffic") return publicTrafficHandler(req, res);
  if (path === "/api/admin/bootstrap") return adminBootstrapHandler(req, res);
  if (path === "/api/admin/pricing") return adminPricingHandler(req, res);
  if (path === "/api/admin/settings") return adminSettingsHandler(req, res);
  if (path === "/api/admin/upload") return adminUploadHandler(req, res);
  if (path === "/api/admin/cars") return adminCarsHandler(req, res);
  if (match("/api/admin/cars")) {
    query.id = path.slice("/api/admin/cars/".length);
    req.query = query;
    return adminCarHandler(req, res);
  }
  if (path === "/api/admin/messages") return adminMessagesHandler(req, res);
  if (match("/api/admin/messages")) {
    query.id = path.slice("/api/admin/messages/".length);
    req.query = query;
    return adminMessageHandler(req, res);
  }
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(JSON.stringify({ error: "API route nebyla nalezena." }));
}
