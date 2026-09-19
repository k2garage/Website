import type { ApiRequest, ApiResponse } from "../_lib/http";
import { json, methodNotAllowed } from "../_lib/http";
import { requireAdmin } from "../_lib/auth";
import { readImageUpload, storeImage } from "../_lib/upload";

export const config = { api: { bodyParser: false } };

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  if (!requireAdmin(req, res)) return;
  try {
    const upload = await readImageUpload(req);
    const url = await storeImage(upload);
    return json(res, 201, { data: { url } });
  } catch (error) {
    return json(res, 400, { error: error instanceof Error ? error.message : "Obrázek se nepodařilo nahrát." });
  }
}
