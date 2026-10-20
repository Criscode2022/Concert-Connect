---
title: Testing · visión
---

# Testing · visión

Conciergo **no** tiene Karma ni Playwright. La red de seguridad es el **typecheck del workspace** y el contrato OpenAPI (Orval + Zod).

| Capa | Runner | Qué cubre | Comando |
|------|--------|-----------|---------|
| Tipos (libs) | `tsc --build` | `lib/db`, `lib/api-zod`, `lib/api-client-react` | `pnpm run typecheck:libs` |
| Tipos (apps) | `tsc --noEmit` | conciergo + api-server | `pnpm run typecheck` |
| Contrato | Orval + Zod | Spec ↔ hooks ↔ handlers | `pnpm --filter @workspace/api-spec run codegen` |

No hay GitHub Actions en el repo (el ciclo de vida es Replit). Un PR local no debería mergearse si `pnpm run typecheck` falla.

Siguientes: [unitarios](./13-testing-unit.md) · [integración](./14-testing-integration.md) · [e2e](./15-testing-e2e.md) · [CI](./16-testing-ci.md).
