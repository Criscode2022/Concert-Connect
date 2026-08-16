---
title: Deploy Vercel
---

# Deploy (Vercel, un solo proyecto)

Igual que Task Cloud: SPA + función Express en el mismo dominio.

Ver el runbook completo: [`VERCEL.md`](../VERCEL.md).

```
pnpm install --frozen-lockfile
pnpm exec turbo run build --filter=@concert-connect/web --filter=@concert-connect/api
```

- Estáticos: `apps/web/dist`
- API: `api/index.js` → `apps/api/dist/app.mjs`
- Rewrite: `/api/*` → función; resto → `index.html`

## Local

```bash
pnpm api          # Express :3001
pnpm start        # Vite :5173 (proxy /api)
```
