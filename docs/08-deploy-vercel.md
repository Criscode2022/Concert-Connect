---
title: Deploy Replit
---

# Deploy (Replit Autoscale)

No es Vercel/Netlify. `.replit` declara:

```toml
[deployment]
router = "application"
deploymentTarget = "autoscale"
```

El mismo proceso sirve el Vite build y Express (`/api`, `/api/__clerk`).

## Env

| Variable | Dónde |
|----------|--------|
| `DATABASE_URL` | Postgres 16 del Repl |
| `CLERK_SECRET_KEY` / `CLERK_PUBLISHABLE_KEY` | API |
| `VITE_CLERK_PUBLISHABLE_KEY` | Front |
| `VITE_GOOGLE_MAPS_API_KEY` | Maps + Places |

La key de Maps debe tener **Maps JavaScript API** y **Places API**.

## Local

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/conciergo run dev
```
