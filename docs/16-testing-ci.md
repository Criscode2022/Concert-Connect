---
title: Testing · CI
---

# Testing · CI

Este repo **no** tiene `.github/workflows`. El “CI” es el typecheck local / Replit antes de merge.

```bash
pnpm run typecheck
```

Equivale a `tsc --build` de las libs + `tsc --noEmit` de `apps/*` y `artifacts/*`.

## Por qué no hay Actions

El remoto es un Repl con secretos (Clerk, Maps, `DATABASE_URL`). Un workflow en GitHub sin esos secretos no puede levantar la API. Añadir un job solo de `typecheck` sería el siguiente paso honesto (sin Maps ni login).

## Qué fallaría en un job así

| Riesgo | Mitigación actual |
|--------|-------------------|
| Spec desfasado | Regenerar Orval a mano |
| TS roto en conciergo o api-server | `pnpm run typecheck` |
| Schema Drizzle vs rutas | Typecheck de `@workspace/db` |
