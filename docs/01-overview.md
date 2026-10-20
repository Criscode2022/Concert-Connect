---
title: Visión general
---

# Visión general · Conciergo

**Conciergo** es una app web mobile-first para ir a conciertos cuando no tienes compañía. Login con Neon Auth, feed y mapa de bolos, matching automático al apuntarte y chat 1-1 en tiempo real.

El producto vive en un **workspace pnpm**: front React+Vite (`artifacts/conciergo`), API Express (`artifacts/api-server`), contratos OpenAPI (`lib/api-spec`) y Postgres + Drizzle (`lib/db`).

## Enlaces

- **Producción:** [conciergo-sigma.vercel.app](https://conciergo-sigma.vercel.app)
- **GitHub:** [código fuente](https://github.com/Criscode2022/Concert-Connect)
- **Health:** `GET /api/healthz` → `{ "status": "ok" }`

## Stack

| Capa | Tecnología |
|------|------------|
| Monorepo | pnpm workspaces, TypeScript 5.9 |
| Web | React, Vite, Tailwind 4, shadcn/ui, Framer Motion, Wouter |
| Auth | Neon Auth (`@neondatabase/neon-js` + Better Auth). La API verifica el JWT con `jose` + JWKS |
| API | Express 5, OpenAPI + Orval + Zod, Socket.io |
| Datos | Neon Postgres + Drizzle ORM (`users.auth_id`) |
| Mapas | Google Maps JS + Places |
| Chat | Socket.io (`/api/socket.io`) |
