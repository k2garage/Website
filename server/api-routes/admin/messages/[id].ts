import type { ApiRequest, ApiResponse } from "../../../../api/_lib/http";
import { json, methodNotAllowed, readJsonBody, stringValue } from "../../../../api/_lib/http";
import { requireAdmin } from "../../../../api/_lib/auth";
import { deleteMessage, getMessage, updateMessageStatus } from "../../../../api/_lib/db";

const messageId = (req: ApiRequest) => stringValue(Array.isArray(req.query?.id) ? req.query?.id[0] : req.query?.id, 100);

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  const id = messageId(req);
  if (!id) return json(res, 400, { error: "Chybí identifikátor zprávy." });
  try {
    if (req.method === "GET") {
      const message = await getMessage(id);
      return message ? json(res, 200, { data: message }) : json(res, 404, { error: "Zpráva nebyla nalezena." });
    }
    if (req.method === "DELETE") {
      return await deleteMessage(id) ? json(res, 200, { data: { id } }) : json(res, 404, { error: "Zpráva nebyla nalezena." });
    }
    if (req.method === "PATCH") {
      const body = await readJsonBody(req);
      const status = body.status === "unread" ? "unread" : "read";
      const message = await updateMessageStatus(id, status);
      return message ? json(res, 200, { data: message }) : json(res, 404, { error: "Zpráva nebyla nalezena." });
    }
    return methodNotAllowed(res, ["GET", "PATCH", "DELETE"]);
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : "Zprávu se nepodařilo upravit." });
  }
}
