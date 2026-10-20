---
title: Deploy Vercel
---

# Deploy (Vercel)

**Producción:** [https://conciergo-sigma.vercel.app](https://conciergo-sigma.vercel.app)

El front y la API se sirven en Vercel. El mismo proceso cubre el build de Vite y Express (`/api`, `/api/socket.io`).

## Env

| Variable | Dónde |
|----------|--------|
| `DATABASE_URL` | Neon Postgres |
| `NEON_AUTH_BASE_URL` / `NEON_AUTH_URL` | API (JWKS) |
| `VITE_NEON_AUTH_URL` | Front (cliente Auth) |
| `VITE_GOOGLE_MAPS_API_KEY` | Maps + Places |

La key de Maps debe tener **Maps JavaScript API** y **Places API**.

## Local

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/conciergo run dev
```
