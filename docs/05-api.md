---
title: Superficie API
---

# Superficie API

Base: `/api`. Fuente: `lib/api-spec/openapi.yaml`.

| Método | Ruta | Auth | Qué hace |
|--------|------|------|----------|
| GET | `/healthz` | pública | `{ status: "ok" }` |
| GET/PUT | `/users/me` | Clerk | Perfil propio |
| GET | `/users/:userId` | Clerk | Perfil ajeno |
| GET | `/events` | opcional | Feed + `isAttending` |
| POST | `/events` | Clerk | Crear bolo |
| POST/DELETE | `/events/:id/attend` | Clerk | Apuntarse / salir (crea matches) |
| GET | `/matches` | Clerk | Conexiones + unread |
| GET/POST | `/matches/:id/messages` | Clerk | Chat |

## Código de ejemplo (health)

```ts
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});
```

`HealthCheckResponse` sale de Zod generado. Si el spec y el handler se desalinean, falla el typecheck.
