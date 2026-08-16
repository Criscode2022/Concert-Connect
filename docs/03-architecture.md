---
title: Arquitectura
---

# Arquitectura

## Diagrama lógico

```
React (Vite)  ConcierGo
    │  Clerk (sesión)
    │  React Query → /api/*
    ▼
Express 5  (/api)
    │  requireAuth → JIT user en Postgres
    │  clerkProxyMiddleware → /api/__clerk
    ▼
PostgreSQL  (Drizzle)
    users, events, event_attendees, matches, messages
```

## Capas

1. **Front** — `apps/web`: Wouter, shadcn, layout sidebar desktop + bottom nav móvil.
2. **API** — `apps/api`: rutas `users`, `events`, `matches`, `health`. En Vercel corre como función serverless (`api/index.js`).
3. **Contrato** — `lib/api-spec/openapi.yaml` → Orval genera hooks (`lib/api-client-react`) y Zod (`lib/api-zod`).
4. **DB** — `lib/db` Drizzle.

## Decisiones de runtime

- **Match automático** al marcar asistencia: un match (y chat) con cada otro asistente.
- **Chat por polling**, no WebSocket (deploy Replit más simple).
- **JIT provisioning**: el primer `requireAuth` inserta al usuario desde claims de Clerk.
