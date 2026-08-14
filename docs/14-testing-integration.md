---
title: Testing · integración
---

# Testing · integración

No hay Supertest. La integración es **codegen + typecheck de todo el grafo**.

```bash
pnpm --filter @workspace/api-spec run codegen
pnpm run typecheck
```

Eso recorre:

1. `openapi.yaml`
2. hooks de `@workspace/api-client-react` (el front solo llama esos hooks)
3. Zod de `@workspace/api-zod` (el server parsea respuestas)
4. Drizzle (`lib/db`) usado por las rutas

Si una ruta Express deja de devolver el schema, el front no compila o Zod lanza. Es integración de **contratos**, no de HTTP vivo (hace falta `DATABASE_URL` + Clerk).
