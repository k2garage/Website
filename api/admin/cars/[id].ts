import type { CarListing } from "../../../shared/admin";
import type { ApiRequest, ApiResponse } from "../../_lib/http";
import { booleanValue, integerValue, json, methodNotAllowed, readJsonBody, stringValue } from "../../_lib/http";
import { requireAdmin } from "../../_lib/auth";
import { deleteCar, getCar, saveCar } from "../../_lib/db";
import { publishContent } from "../../_lib/publish";

function carId(req: ApiRequest) {
  const value = req.query?.id;
  return stringValue(Array.isArray(value) ? value[0] : value, 100);
}

function validateCar(body: Record<string, unknown>, id: string): Omit<CarListing, "createdAt" | "updatedAt"> | { error: string } {
  const make = stringValue(body.make, 80);
  const model = stringValue(body.model, 100);
  const title = stringValue(body.title, 160) || [make, model].filter(Boolean).join(" ");
  const price = integerValue(body.price, -1);
  const year = integerValue(body.year, -1);
  const mileage = integerValue(body.mileage, -1);
  if (!title || !make || !model) return { error: "Vyplňte značku, model a název vozu." };
  if (price < 0 || year < 1900 || year > new Date().getFullYear() + 1 || mileage < 0) return { error: "Zkontrolujte cenu, rok výroby a nájezd." };
  return { id, title, make, model, price, currency: stringValue(body.currency, 10) || "Kč", year, mileage, fuel: stringValue(body.fuel, 40), transmission: stringValue(body.transmission, 40), power: stringValue(body.power, 40) || null, description: stringValue(body.description, 5000) || null, photoUrl: stringValue(body.photoUrl, 2000) || null, status: body.status === "sold" ? "sold" : "available", featured: booleanValue(body.featured) };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  const id = carId(req);
  if (!id) return json(res, 400, { error: "Chybí identifikátor vozidla." });
  if (req.method === "GET") {
    try { const car = await getCar(id); return car ? json(res, 200, { data: car }) : json(res, 404, { error: "Vozidlo nebylo nalezeno." }); }
    catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : "Vozidlo nelze načíst." }); }
  }
  if (req.method === "DELETE") {
    try {
      if (!await deleteCar(id)) return json(res, 404, { error: "Vozidlo nebylo nalezeno." });
      const publication = await publishContent();
      return json(res, 200, { data: { id }, meta: { publication } });
    } catch (error) { return json(res, 500, { error: error instanceof Error ? error.message : "Vozidlo se nepodařilo odstranit." }); }
  }
  if (req.method !== "PUT") return methodNotAllowed(res, ["GET", "PUT", "DELETE"]);
  try {
    if (!await getCar(id)) return json(res, 404, { error: "Vozidlo nebylo nalezeno." });
    const input = validateCar(await readJsonBody(req), id);
    if ("error" in input) return json(res, 400, input);
    const car = await saveCar(input, false);
    const publication = await publishContent();
    return json(res, 200, { data: car, meta: { publication } });
  } catch (error) { return json(res, 500, { error: error instanceof Error ? error.message : "Vozidlo se nepodařilo uložit." }); }
}
