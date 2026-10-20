---
title: Arquitectura
---

# Arquitectura

## Diagrama lógico

```
React (Vite)  Conciergo
    │  Neon Auth (sesión + JWT)
    │  React Query → /api/*
    │  Socket.io → /api/socket.io
    ▼
Express 5  (/api)
    │  requireAuth → verifica JWT (jose + JWKS) + JIT user
    ▼
Neon Postgres  (Drizzle)
    users, events, event_attendees, matches, messages
```

## Capas

1. **Front** — `artifacts/conciergo`: Wouter, shadcn, layout sidebar desktop + bottom nav móvil.
2. **API** — `artifacts/api-server`: rutas `users`, `events`, `matches`, `health`.
3. **Contrato** — `lib/api-spec/openapi.yaml` → Orval genera hooks (`lib/api-client-react`) y Zod (`lib/api-zod`).
4. **DB** — `lib/db` Drizzle.

## Decisiones de runtime

- **Match automático** al marcar asistencia: un match (y chat) con cada otro asistente.
- **Chat por Socket.io** (`/api/socket.io`), autenticado con el mismo JWT.
- **JIT provisioning**: el primer `requireAuth` inserta al usuario desde el `sub` de Neon Auth (`users.auth_id`).
