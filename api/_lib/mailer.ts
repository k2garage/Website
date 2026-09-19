import type { ContactMessage } from "../../shared/admin";
import { getSettings } from "./db";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);

export async function notifyNewMessage(message: ContactMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY není nastaven." };

  const settings = await getSettings();
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL ?? settings?.email;
  if (!recipient) return { sent: false, reason: "Chybí cílová e-mailová adresa." };

  const sender = process.env.RESEND_FROM_EMAIL ?? "K2 garage <noreply@k2garage.cz>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: message.email,
      subject: `[Web] ${message.subject}`,
      html: `<h2>Nová zpráva z webu</h2><p><strong>Jméno:</strong> ${escapeHtml(message.name)}<br><strong>E-mail:</strong> ${escapeHtml(message.email)}<br><strong>Telefon:</strong> ${escapeHtml(message.phone ?? "neuveden")}<br><strong>Zdroj:</strong> ${escapeHtml(message.source)}</p><p><strong>Zpráva</strong><br>${escapeHtml(message.message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
  if (!response.ok) return { sent: false, reason: "Resend zprávu nepřijal." };
  return { sent: true };
}
