import type { PricingTier } from "../../shared/admin";
import type { ApiRequest, ApiResponse } from "../_lib/http";
import { booleanValue, integerValue, json, methodNotAllowed, readJsonBody, stringValue } from "../_lib/http";
import { requireAdmin } from "../_lib/auth";
import { getPricing, savePricing } from "../_lib/db";
import { publishContent } from "../_lib/publish";

function validateTier(value: unknown, index: number): PricingTier | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const title = stringValue(raw.title, 120);
  const priceLabel = stringValue(raw.priceLabel, 80);
  if (!title || !priceLabel) return null;
  return {
    id: stringValue(raw.id, 100) || crypto.randomUUID(),
    title,
    description: stringValue(raw.description, 1000),
    priceLabel,
    highlighted: booleanValue(raw.highlighted),
    sortOrder: integerValue(raw.sortOrder, index + 1),
    features: Array.isArray(raw.features) ? raw.features.map((feature) => stringValue(feature, 180)).filter(Boolean).slice(0, 10) : [],
    updatedAt: new Date().toISOString(),
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method === "GET") {
    try { return json(res, 200, { data: await getPricing() }); }
    catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : "Ceník nelze načíst." }); }
  }
  if (req.method !== "PUT") return methodNotAllowed(res, ["GET", "PUT"]);
  try {
    const body = await readJsonBody<{ tiers?: unknown[] }>(req);
    const tiers = (body.tiers ?? []).map(validateTier).filter((tier): tier is PricingTier => Boolean(tier));
    if (!tiers.length) return json(res, 400, { error: "Přidejte alespoň jednu cenovou položku." });
    const saved = await savePricing(tiers);
    const publication = await publishContent();
    return json(res, 200, { data: saved, meta: { publication } });
  } catch (error) { return json(res, 500, { error: error instanceof Error ? error.message : "Ceník se nepodařilo uložit." }); }
}
