---
title: Estructura del workspace
---

# Estructura (Turborepo + pnpm)

React + Express, desplegable en Vercel como un solo proyecto (mismo patrón que Task Cloud).

| Path | Rol |
|------|-----|
| `apps/web` | App React + Vite (`@concert-connect/web`) |
| `apps/api` | Express + Clerk (`@concert-connect/api`) |
| `api/index.js` | Entrada serverless Vercel |
| `lib/api-spec` | OpenAPI + Orval |
| `lib/api-client-react` | Hooks generados |
| `lib/api-zod` | Schemas Zod |
| `lib/db` | Drizzle + Neon HTTP |
| `artifacts/conciergo-deck` | Deck (no prod) |
| `artifacts/mockup-sandbox` | Sandbox UI (no prod) |

```bash
pnpm api      # API :3001
pnpm start    # web :5173
pnpm build    # turbo web + api
```

Tras cambiar el spec: `pnpm --filter @workspace/api-spec run codegen`.
