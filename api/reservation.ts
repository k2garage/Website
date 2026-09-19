import Busboy from "busboy";
import type { ApiRequest, ApiResponse } from "./_lib/http";
import { clientIp, json, methodNotAllowed, stringValue } from "./_lib/http";
import { createMessage } from "./_lib/db";
import { notifyNewMessage } from "./_lib/mailer";
import { isRateLimited } from "./_lib/rateLimit";

export const config = { api: { bodyParser: false } };

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const form = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  const result = await response.json().catch(() => ({ success: false })) as { success?: boolean };
  return result.success === true;
}

function parseForm(req: ApiRequest) {
  return new Promise<Record<string, string>>((resolve, reject) => {
    const contentType = req.headers["content-type"] ?? "";
    if (!contentType.includes("multipart/form-data")) return reject(new Error("Očekává se formulář rezervace."));
    const parser = Busboy({ headers: req.headers, limits: { fields: 30, files: 5, fileSize: 8 * 1024 * 1024 } });
    const fields: Record<string, string> = {};
    parser.on("field", (name, value) => { fields[name] = value.slice(0, 5000); });
    parser.on("file", (_name, stream) => stream.resume());
    parser.on("filesLimit", () => reject(new Error("Můžete přiložit nejvýše 5 fotografií.")));
    parser.on("error", reject);
    parser.on("finish", () => resolve(fields));
    req.pipe(parser);
  });
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const ip = clientIp(req);
  if (isRateLimited(`${ip}:reservation`, 4)) return json(res, 429, { error: "Příliš mnoho odeslaných formulářů. Zkuste to prosím později." });

  try {
    const fields = await parseForm(req);
    if (stringValue(fields.website, 100)) return json(res, 200, { data: { accepted: true } });
    if (!await verifyTurnstile(stringValue(fields.turnstileToken, 3000), ip)) return json(res, 400, { error: "Bezpečnostní ověření nebylo platné. Obnovte stránku a zkuste to znovu." });
    const name = `${stringValue(fields.firstName, 80)} ${stringValue(fields.lastName, 80)}`.trim();
    const email = stringValue(fields.email, 254).toLowerCase();
    const phone = stringValue(fields.phone, 50);
    const serviceLabel = stringValue(fields.serviceLabel, 120) || "Rezervace";
    const note = stringValue(fields.note, 4000);
    if (!name || !email.includes("@") || !phone || !fields.service) return json(res, 400, { error: "Vyplňte kontaktní údaje a vyberte službu." });
    const detailKeys = ["brand", "model", "year", "vin", "tyreSize", "vehicleLink", "country", "preferredDate"];
    const details = detailKeys.map((key) => fields[key] ? `${key}: ${stringValue(fields[key], 500)}` : "").filter(Boolean).join("\n");
    const stored = await createMessage({ name, email, phone, subject: `Rezervace: ${serviceLabel}`, message: [note, details].filter(Boolean).join("\n\n") || "Nová rezervační poptávka.", source: "reservation", metadata: { service: fields.service, serviceLabel, submittedFrom: "/rezervace" } });
    const notification = await notifyNewMessage(stored);
    return json(res, 201, { data: { accepted: true, notificationSent: notification.sent } });
  } catch (error) { return json(res, 500, { error: error instanceof Error ? error.message : "Poptávku se nepodařilo odeslat." }); }
}
