# Deploy Concert-Connect on Vercel (single project)

The Turborepo deploys as **one Vercel project**, same pattern as Task Cloud:

- `apps/web` (React + Vite) builds to static files in `apps/web/dist`
- `apps/api` (Express) compiles to `apps/api/dist` and runs as **one serverless function** via root `api/index.js`
- `/api/*` is rewritten to that function; everything else is the SPA
- Frontend and API share the same origin, so `customFetch` can keep relative `/api/...` paths

Wired in the root `vercel.json`.

## 1. Import the repo

1. Open [vercel.com/new](https://vercel.com/new) and import `Criscode2022/Concert-Connect`.
2. Leave **Root Directory** at the repository root.
3. Framework preset: **Other** (`vercel.json` sets install/build/output).

## 2. Environment variables

Project → Settings → Environment Variables (Production + Preview):

| Name | Required | Notes |
|------|----------|-------|
| `DATABASE_URL` | yes | Neon **pooled** connection string |
| `CLERK_SECRET_KEY` | yes | Clerk secret |
| `CLERK_PUBLISHABLE_KEY` | yes | Clerk publishable (API / proxy) |
| `VITE_CLERK_PUBLISHABLE_KEY` | yes | Same publishable key (baked into the Vite build) |
| `VITE_GOOGLE_MAPS_API_KEY` | yes for map | Enable Maps JavaScript + Places |
| `VITE_CLERK_PROXY_URL` | no | Leave empty on Vercel (Clerk talks to clerk.com) |

## 3. Deploy

Push to the connected branch. Vercel runs:

```
pnpm install --frozen-lockfile
pnpm exec turbo run build --filter=@concert-connect/web --filter=@concert-connect/api
```

## 4. Smoke

- `GET https://<project>.vercel.app/api/health` → `{ "ok": true, "service": "concert-connect-api" }`
- `GET https://<project>.vercel.app/api/healthz` → `{ "status": "ok" }`
- Open the site, sign in with Clerk, list events

## Realtime chat

Socket.io (`/api/socket.io`) only runs on the **long-lived** local/Replit process (`pnpm api`). Vercel serverless does not keep a WebSocket server. REST (`/api/matches`, messages via HTTP if present) still works.

## Local

```bash
cp .env.example .env
pnpm install
pnpm api          # Express :3001
pnpm start        # Vite :5173, proxies /api → :3001
```
