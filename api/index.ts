import type { ApiRequest, ApiResponse } from "./_lib/http";
import { json } from "./_lib/http";

function pathOf(req: ApiRequest) {
  return (req.url ?? "").split("?")[0].replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

type Handler = (req: ApiRequest, res: ApiResponse) => unknown | Promise<unknown>;

async function handlerFor(path: string, query: Record<string, string | string[] | undefined>, req: ApiRequest): Promise<Handler | null> {
  if (path === "/api/auth/session") return (await import("../server/api-routes/auth/session")).default;
  if (path === "/api/auth/login") return (await import("../server/api-routes/auth/login")).default;
  if (path === "/api/auth/logout") return (await import("../server/api-routes/auth/logout")).default;
  if (path === "/api/contact") return (await import("../server/api-routes/contact")).default;
  if (path === "/api/reservation") return (await import("../server/api-routes/reservation")).default;
  if (path === "/api/public/cars") return (await import("../server/api-routes/public/cars")).default;
  if (path === "/api/public/pricing") return (await import("../server/api-routes/public/pricing")).default;
  if (path === "/api/public/settings") return (await import("../server/api-routes/public/settings")).default;
  if (path === "/api/public/traffic") return (await import("../server/api-routes/public/traffic")).default;
  if (path === "/api/admin/bootstrap") return (await import("../server/api-routes/admin/bootstrap")).default;
  if (path === "/api/admin/pricing") return (await import("../server/api-routes/admin/pricing")).default;
  if (path === "/api/admin/settings") return (await import("../server/api-routes/admin/settings")).default;
  if (path === "/api/admin/upload") return (await import("../server/api-routes/admin/upload")).default;
  if (path === "/api/admin/cars") return (await import("../server/api-routes/admin/cars/index")).default;
  if (path.startsWith("/api/admin/cars/")) {
    query.id = path.slice("/api/admin/cars/".length);
    req.query = query;
    return (await import("../server/api-routes/admin/cars/[id]")).default;
  }
  if (path === "/api/admin/messages/reply") return (await import("../server/api-routes/admin/messages/reply")).default;
  if (path === "/api/admin/messages") return (await import("../server/api-routes/admin/messages/index")).default;
  if (path.startsWith("/api/admin/messages/")) {
    query.id = path.slice("/api/admin/messages/".length);
    req.query = query;
    return (await import("../server/api-routes/admin/messages/[id]")).default;
  }
  return null;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const path = pathOf(req);
    const query = { ...(req.query ?? {}) };
    const route = await handlerFor(path, query, req);
    if (route) return await route(req, res);
    return json(res, 404, { error: "API route nebyla nalezena." });
  } catch (error) {
    console.error("API handler failure", error);
    return json(res, 500, { error: "Interní chyba API." });
  }
}
