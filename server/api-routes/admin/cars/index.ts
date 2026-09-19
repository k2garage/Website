import type { CarListing } from "../../../../shared/admin";
import type { ApiRequest, ApiResponse } from "../../../../api/_lib/http";
import { booleanValue, integerValue, json, methodNotAllowed, readJsonBody, stringValue } from "../../../../api/_lib/http";
import { requireAdmin } from "../../../../api/_lib/auth";
import { getCars, saveCar } from "../../../../api/_lib/db";
import { publishContent } from "../../../../api/_lib/publish";

function validateCar(body: Record<string, unknown>, id: string): Omit<CarListing, "createdAt" | "updatedAt"> | { error: string } {
  const make = stringValue(body.make, 80);
  const model = stringValue(body.model, 100);
  const title = stringValue(body.title, 160) || [make, model].filter(Boolean).join(" ");
  const price = integerValue(body.price, -1);
  const year = integerValue(body.year, -1);
  const mileage = integerValue(body.mileage, -1);
  if (!title || !make || !model) return { error: "Vyplňte značku, model a název vozu." };
  if (price < 0 || year < 1900 || year > new Date().getFullYear() + 1 || mileage < 0) return { error: "Zkontrolujte cenu, rok výroby a nájezd." };
  return {
    id,
    title,
    make,
    model,
    price,
    currency: stringValue(body.currency, 10) || "Kč",
    year,
    mileage,
    fuel: stringValue(body.fuel, 40),
    transmission: stringValue(body.transmission, 40),
    power: stringValue(body.power, 40) || null,
    description: stringValue(body.description, 5000) || null,
    photoUrl: stringValue(body.photoUrl, 2000) || null,
    status: body.status === "sold" ? "sold" : "available",
    featured: booleanValue(body.featured),
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method === "GET") {
    try { return json(res, 200, { data: await getCars({ includeSold: true }) }); }
    catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : "Vozidla nelze načíst." }); }
  }
  if (req.method !== "POST") return methodNotAllowed(res, ["GET", "POST"]);

  try {
    const input = validateCar(await readJsonBody(req), crypto.randomUUID());
    if ("error" in input) return json(res, 400, input);
    const car = await saveCar(input, true);
    if (!car) return json(res, 500, { error: "Vozidlo se nepodařilo uložit." });
    const publication = await publishContent();
    return json(res, 201, { data: car, meta: { publication } });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : "Vozidlo se nepodařilo uložit." });
  }
}
