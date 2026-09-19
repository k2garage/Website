import Busboy from "busboy";
import { put } from "@vercel/blob";
import type { ApiRequest } from "./http";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/x-icon"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type UploadedImage = { buffer: Buffer; filename: string; mimeType: string; kind: "car" | "site" };

export async function readImageUpload(req: ApiRequest): Promise<UploadedImage> {
  const contentType = req.headers["content-type"] ?? "";
  if (!contentType.includes("multipart/form-data")) throw new Error("Očekává se formulář s obrázkem.");

  return new Promise((resolve, reject) => {
    const parser = Busboy({ headers: req.headers, limits: { files: 1, fileSize: MAX_FILE_SIZE, fields: 4 } });
    let kind: "car" | "site" = "car";
    let upload: UploadedImage | null = null;
    let tooLarge = false;

    parser.on("field", (name, value) => {
      if (name === "kind" && (value === "car" || value === "site")) kind = value;
    });
    parser.on("file", (name, stream, info) => {
      if (name !== "file") {
        stream.resume();
        return;
      }
      const buffers: Buffer[] = [];
      stream.on("data", (chunk) => buffers.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      stream.on("limit", () => { tooLarge = true; });
      stream.on("end", () => {
        upload = { buffer: Buffer.concat(buffers), filename: info.filename, mimeType: info.mimeType, kind };
      });
    });
    parser.on("error", reject);
    parser.on("finish", () => {
      if (tooLarge) return reject(new Error("Soubor může mít maximálně 5 MB."));
      if (!upload || !upload.buffer.length) return reject(new Error("Vyberte obrázkový soubor."));
      if (!allowedMimeTypes.has(upload.mimeType)) return reject(new Error("Povolené formáty jsou JPG, PNG, WEBP, AVIF, SVG a ICO."));
      resolve(upload);
    });
    req.pipe(parser);
  });
}

export async function storeImage(upload: UploadedImage) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("Úložiště obrázků není připojeno. Doplňte BLOB_READ_WRITE_TOKEN.");
  const cleanName = upload.filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
  const pathname = `admin/${upload.kind}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${cleanName}`;
  const blob = await put(pathname, upload.buffer, { access: "public", contentType: upload.mimeType, token, addRandomSuffix: false });
  return blob.url;
}
