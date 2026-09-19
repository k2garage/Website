import { contentSnapshot } from "./db";

export type PublishResult = {
  mode: "github" | "deploy-hook" | "database";
  ok: boolean;
  message: string;
};

async function publishToGitHub(snapshot: unknown): Promise<PublishResult> {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!token || !repository) throw new Error("GitHub není nakonfigurován.");

  const path = process.env.GITHUB_CONTENT_FILE ?? "data/admin-content.json";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const apiUrl = `https://api.github.com/repos/${repository}/contents/${path}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "k2-garage-admin",
  };

  const existing = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
  const existingJson = existing.ok ? await existing.json() as { sha?: string } : null;
  if (!existing.ok && existing.status !== 404) throw new Error("GitHub obsahový soubor nelze načíst.");

  const update = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "content(admin): publish dashboard changes",
      content: Buffer.from(JSON.stringify(snapshot, null, 2)).toString("base64"),
      branch,
      ...(existingJson?.sha ? { sha: existingJson.sha } : {}),
    }),
  });
  if (!update.ok) throw new Error("GitHub změnu neuložil.");

  return { mode: "github", ok: true, message: "Obsah byl publikován do GitHubu; Vercel nasadí novou verzi automaticky." };
}

async function triggerDeployHook(): Promise<PublishResult> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) return { mode: "database", ok: true, message: "Změna je uložena v databázi a veřejný web ji načte přes API." };
  const response = await fetch(hook, { method: "POST" });
  if (!response.ok) throw new Error("Vercel Deploy Hook neodpověděl úspěšně.");
  return { mode: "deploy-hook", ok: true, message: "Změna je uložená; Vercel sestavuje aktualizovanou verzi webu." };
}

export async function publishContent(): Promise<PublishResult> {
  try {
    const snapshot = await contentSnapshot();
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY) return await publishToGitHub(snapshot);
    return await triggerDeployHook();
  } catch (error) {
    return { mode: "database", ok: false, message: error instanceof Error ? error.message : "Publikování se nepodařilo spustit." };
  }
}
