import type { ApiRequest, ApiResponse } from "../../../../api/_lib/http";
import { json, methodNotAllowed, readJsonBody, stringValue } from "../../../../api/_lib/http";
import { requireAdmin } from "../../../../api/_lib/auth";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const body = await readJsonBody(req);
    const to = stringValue(body.to, 320);
    const subject = stringValue(body.subject, 200);
    const text = stringValue(body.text, 10000);
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL ?? "K2 garage <noreply@k2garage.cz>";
    if (!to || !to.includes("@") || !subject || !text) return json(res, 400, { error: "Vyplňte příjemce, předmět a text zprávy." });
    if (!apiKey) return json(res, 503, { error: "RESEND_API_KEY není na Vercelu nastavený." });
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text, html: `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>` }),
    });
    if (!response.ok) return json(res, 502, { error: "Resend e-mail nepřijal." });
    return json(res, 200, { data: { sent: true } });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : "E-mail se nepodařilo odeslat." });
  }
}
