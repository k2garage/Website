# K2 garage administration deployment guide

**AutoAdmin Pro** is a Vite and React administration interface for the supplied K2 garage website. The interface is available at `/dashboard` and provides management views for vehicle listings, website enquiries, price tiers, and basic site configuration. The public website now includes `/inzeraty`, which reads the active listings from the same data source.

## What the project provides

The dashboard has a dark navigation rail and a light working area. It includes a summary of listings, unread enquiries, and traffic, together with an inbox that can mark messages as read or delete them. The listing editor supports vehicle details, price, status, featured state, description, and image upload. The price editor controls the three highlighted public price cards. The settings editor stores the logo, favicon, contact details, and social links.

The application supports two publication paths. The preferred path writes a compact content snapshot to the connected GitHub repository, which triggers the project’s normal Vercel deployment. Vercel deploy hooks can be used instead when a repository write is not desired. Vercel deploy hooks accept a server-side POST request and should be treated like a secret because the URL authorizes a deployment. [1]

## Required services

| Service | Purpose | Required configuration |
| --- | --- | --- |
| Neon PostgreSQL | Persists listings, messages, pricing, settings, and daily traffic counts | `DATABASE_URL` |
| Vercel | Hosts the Vite frontend and the serverless `/api` functions | Connect the GitHub repository |
| Vercel Blob | Stores images uploaded from the dashboard | `BLOB_READ_WRITE_TOKEN` |
| Resend | Sends email notification for a new public enquiry | `RESEND_API_KEY` and verified sender address |
| GitHub | Creates a versioned content snapshot and triggers normal Vercel deployment | `GITHUB_TOKEN`, repository, and branch variables |

Neon can be connected to Vercel through a Vercel-managed integration, a Neon-managed integration, or a manual connection string. The supplied code uses the standard `DATABASE_URL` environment variable, so it works with any of these options. [2]

## First production setup

Create or update the GitHub repository with the completed project files. In Vercel, import that repository as a Vite project. The existing build command is `pnpm build`, and the static output directory is `dist/public`. The `api` directory is detected as Vercel serverless functions; no separate Express server is required in production.

Create a Neon PostgreSQL database and run [`database/migrations/001_admin_schema.sql`](database/migrations/001_admin_schema.sql) once in its SQL editor. The migration creates the five tables used by the dashboard and inserts initial settings and price tiers. Then add the environment variables from [`.env.example`](.env.example) in the Vercel project. Add the variables to Production, Preview, and Development where appropriate. Do not place secrets in a `VITE_` variable, source file, or Git commit.

Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `OWNER_USERNAME`, `OWNER_PASSWORD`, and a long random `ADMIN_SESSION_SECRET` before opening `/dashboard`. The login endpoint creates a signed, HTTP-only session cookie and records whether the account is `admin` or `owner`. Until those values are set, `/dashboard` deliberately opens only a local demonstration mode, which does not save data to production.

Connect a Vercel Blob store if the client will upload car, logo, or favicon images. The dashboard only accepts image files and enforces a 5 MB upload limit. The project stores the blob token only on the server, never in the browser bundle.

For enquiry notifications, configure a verified Resend sender in `RESEND_FROM_EMAIL`, add `RESEND_API_KEY`, and set `CONTACT_RECIPIENT_EMAIL`. The public contact form posts to `/api/contact`; the reservation form posts to `/api/reservation`. Both records are stored in `contact_messages`, so they appear in **Zprávy** even if a notification email is temporarily unavailable.

## Publishing changes through GitHub and Vercel

To publish content through the connected GitHub repository, create a fine-grained GitHub token with **Contents: Read and write** permission for the target repository. In Vercel, add `GITHUB_TOKEN`, `GITHUB_REPOSITORY` in `owner/repository` format, `GITHUB_BRANCH`, and optionally `GITHUB_CONTENT_FILE`. The dashboard writes a generated JSON snapshot to that file on a listing, pricing, or settings save. Because the repository is connected to Vercel, the Git commit triggers a deployment automatically.

If GitHub write access is not available, create one Vercel deploy hook under **Project Settings → Git → Deploy Hooks**, select the production branch, and save the generated hook URL as `VERCEL_DEPLOY_HOOK_URL`. The implementation invokes the URL only from the server after a successful content save. This is the fallback publication path. [1]

> **Operational recommendation:** Prefer the GitHub path when the team needs an auditable history of dashboard publishing events. Prefer a deploy hook only when the content database is the source of truth and a repository snapshot is not needed.

## Local development and verification

Install dependencies with `pnpm install`. Run `pnpm check` to type-check both the client and the Vercel functions. Run `pnpm build` to create the Vercel production build. The project has been checked and built successfully after the dashboard implementation.

Use `pnpm dev` to review the public site and the non-persistent dashboard demo at `http://localhost:3000/dashboard`. For a local Vercel-function test, use the Vercel CLI with the same environment variables that will be used in the deployment. This is important because Vite’s development server does not execute the contents of the root `api` folder.

## Main routes

| Route | Audience | Purpose |
| --- | --- | --- |
| `/dashboard` | Authenticated admin or owner | Dashboard overview |
| `/dashboard/messages` | Authenticated admin or owner | Enquiry inbox and message actions |
| `/dashboard/listings` | Authenticated admin or owner | Vehicle CRUD and image upload |
| `/dashboard/pricing` | Authenticated admin or owner | Public price-card editor |
| `/dashboard/settings` | Authenticated admin or owner | Site identity and contact configuration |
| `/inzeraty` | Public visitors | Active vehicle listings |
| `/api/contact` | Public contact form | Stores a message and requests email notification |
| `/api/reservation` | Public reservation form | Stores a reservation message and requests email notification |

## Security notes

The implementation validates all server-side write requests and uses signed HTTP-only login cookies. Public contact and reservation endpoints include a honeypot field and a small in-memory request limit that protects typical low-volume traffic. The reservation endpoint verifies Cloudflare Turnstile whenever `TURNSTILE_SECRET_KEY` is configured. For higher traffic or multiple Vercel regions, replace the in-memory limit with an edge-capable shared store such as Upstash Redis.

The Vercel Blob token, Resend API key, GitHub token, session secret, deploy-hook URL, and database connection string are secrets. They must remain server-side in Vercel environment settings. Revoke and replace a deploy hook immediately if its URL becomes exposed. [1]

## References

[1]: https://vercel.com/docs/deploy-hooks "Creating & Triggering Deploy Hooks"
[2]: https://neon.com/docs/guides/vercel-overview "Integrating Neon with Vercel"
