import type { ApiResponse } from "@shared/admin";

export class AdminApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "AdminApiError";
  }
}

export async function adminApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
    ...init,
  });

  const body = await response.json().catch(() => null) as ApiResponse<T> | { error?: string; message?: string } | null;
  if (!response.ok) {
    const message = body && "error" in body ? body.error : body && "message" in body ? body.message : "Požadavek se nepodařilo dokončit.";
    throw new AdminApiError(message ?? "Požadavek se nepodařilo dokončit.", response.status);
  }

  return (body as ApiResponse<T>).data;
}

export async function uploadAdminImage(file: File, kind: "car" | "site"): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", kind);
  return adminApi<{ url: string }>("/api/admin/upload", { method: "POST", body: form });
}
