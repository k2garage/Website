import type { SiteSettings } from "../../shared/admin";
import type { ApiRequest, ApiResponse } from "../_lib/http";
import { json, methodNotAllowed, readJsonBody, stringValue } from "../_lib/http";
import { requireAdmin } from "../_lib/auth";
import { getSettings, saveSettings } from "../_lib/db";
import { publishContent } from "../_lib/publish";

function urlOrEmpty(value: unknown) {
  const string = stringValue(value, 2000);
  if (!string) return null;
  if (string.startsWith("/")) return string;
  try { return new URL(string).toString(); } catch { return null; }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method === "GET") {
    try { const settings = await getSettings(); return settings ? json(res, 200, { data: settings }) : json(res, 404, { error: "Nastavení nebylo nalezeno." }); }
    catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : "Nastavení nelze načíst." }); }
  }
  if (req.method !== "PUT") return methodNotAllowed(res, ["GET", "PUT"]);
  try {
    const body = await readJsonBody<Record<string, unknown>>(req);
    const email = stringValue(body.email, 254).toLowerCase();
    const phone = stringValue(body.phone, 50);
    const siteName = stringValue(body.siteName, 120);
    if (!siteName || !email.includes("@") || !phone) return json(res, 400, { error: "Vyplňte název webu, platný e-mail a telefon." });
    const settings: SiteSettings = { id: "site", siteName, email, phone, logoUrl: urlOrEmpty(body.logoUrl), faviconUrl: urlOrEmpty(body.faviconUrl), facebookUrl: urlOrEmpty(body.facebookUrl), instagramUrl: urlOrEmpty(body.instagramUrl), youtubeUrl: urlOrEmpty(body.youtubeUrl), updatedAt: new Date().toISOString() };
    const saved = await saveSettings(settings);
    const publication = await publishContent();
    return json(res, 200, { data: saved, meta: { publication } });
  } catch (error) { return json(res, 500, { error: error instanceof Error ? error.message : "Nastavení se nepodařilo uložit." }); }
}
