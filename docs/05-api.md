---
title: Superficie API
---

# Superficie API

Base: `/api`. Fuente: `lib/api-spec/openapi.yaml`.

| Método | Ruta | Auth | Qué hace |
|--------|------|------|----------|
| GET | `/healthz` | pública | `{ status: "ok" }` |
| GET/PUT | `/users/me` | JWT Neon Auth | Perfil propio |
| GET | `/users/:userId` | JWT Neon Auth | Perfil ajeno |
| GET | `/events` | opcional | Feed + `isAttending` |
| POST | `/events` | JWT Neon Auth | Crear bolo |
| POST/DELETE | `/events/:id/attend` | JWT Neon Auth | Apuntarse / salir (crea matches) |
| GET | `/matches` | JWT Neon Auth | Conexiones + unread |
| GET/POST | `/matches/:id/messages` | JWT Neon Auth | Historial de chat |
| WS | `/api/socket.io` | JWT Neon Auth | Chat en tiempo real |

## Código de ejemplo (health)

```ts
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});
```

`HealthCheckResponse` sale de Zod generado. Si el spec y el handler se desalinean, falla el typecheck.
