---
title: Estructura del workspace
---

# Estructura (pnpm workspace)

No es Angular/Nest. Es un monorepo Replit (`pnpm-workspace.yaml`).

| Path | Rol |
|------|-----|
| `artifacts/conciergo` | App React + Vite |
| `artifacts/api-server` | Express + Neon Auth (`jose`) |
| `artifacts/mockup-sandbox` | Sandbox de UI (no prod) |
| `lib/api-spec` | OpenAPI + Orval |
| `lib/api-client-react` | Hooks generados |
| `lib/api-zod` | Schemas Zod generados |
| `lib/db` | Drizzle + schema |
| `replit.md` | Runbook del producto |

Tras cambiar el spec: `pnpm --filter @workspace/api-spec run codegen`.
