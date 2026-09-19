import type { ApiRequest, ApiResponse } from "./_lib/http";
import { clientIp, json, methodNotAllowed, readJsonBody, stringValue } from "./_lib/http";
import { createMessage } from "./_lib/db";
import { notifyNewMessage } from "./_lib/mailer";
import { isRateLimited } from "./_lib/rateLimit";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  if (isRateLimited(`${clientIp(req)}:contact`, 5)) return json(res, 429, { error: "Příliš mnoho odeslaných formulářů. Zkuste to prosím později." });

  try {
    const body = await readJsonBody<Record<string, unknown>>(req);
    if (stringValue(body.website, 100)) return json(res, 200, { data: { accepted: true } });
    const name = stringValue(body.name, 120);
    const email = stringValue(body.email, 254).toLowerCase();
    const phone = stringValue(body.phone, 50);
    const subject = stringValue(body.subject, 160) || "Dotaz z kontaktního formuláře";
    const message = stringValue(body.message, 4000);
    if (!name || !email.includes("@") || !message) return json(res, 400, { error: "Vyplňte jméno, platný e-mail a zprávu." });
    const stored = await createMessage({ name, email, phone: phone || null, subject, message, source: "contact", metadata: { sourcePage: stringValue(body.sourcePage, 200) || "/kontakt" } });
    const notification = await notifyNewMessage(stored);
    return json(res, 201, { data: { accepted: true, notificationSent: notification.sent } });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : "Zprávu se nepodařilo odeslat." });
  }
}
