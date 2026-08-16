---
title: Visión general
---

# Visión general · Concert-Connect (ConcierGo)

**Concert-Connect** es el repo de **ConcierGo**: una app web mobile-first para ir a conciertos cuando no tienes compañía. Login con Clerk, feed y mapa de bolos, matching automático al apuntarte y chat 1-1.

El producto vive en un **Turborepo pnpm**: front React+Vite (`apps/web`), API Express (`apps/api`), contratos OpenAPI (`lib/api-spec`) y Postgres + Drizzle + Neon (`lib/db`). Se despliega en **un proyecto Vercel** (estáticos + función `/api`).

## Enlaces

- **GitHub:** [Criscode2022/Concert-Connect](https://github.com/Criscode2022/Concert-Connect)
- **Replit:** [replit.com/@cristiancode202/Concert-Connect](https://replit.com/@cristiancode202/Concert-Connect)
- **Health:** `GET /api/healthz` → `{ "status": "ok" }`

## Stack

| Capa | Tecnología |
|------|------------|
| Monorepo | pnpm workspaces, TypeScript 5.9 |
| Web | React, Vite, Tailwind 4, shadcn/ui, Framer Motion, Wouter |
| Auth | Clerk (`@clerk/react` + `@clerk/express`), proxy `/api/__clerk` |
| API | Express 5, OpenAPI + Orval + Zod |
| Datos | PostgreSQL + Drizzle ORM |
| Mapas | Google Maps JS + Places |
