---
title: Visión general
---

# Visión general · Conciergo

**Conciergo** es una web mobile-first para encontrar con quién ir a un concierto. Cada bolo tiene su ficha y su marcador en el mapa. Al apuntarte, la app te conecta con cada persona que también va y os abre un chat para quedar antes. No hay swipes ni perfiles que puntuar: ir al mismo concierto es la única condición.

El cartel y el mapa se ven sin cuenta. Apuntarse, añadir un bolo, ver tus conexiones, chatear y editar el perfil piden sesión con Neon Auth (email y contraseña, o Google).

El repo se llama `Concert-Connect`; la marca es **Conciergo** (en la interfaz, _ConcierGo_). Es un workspace pnpm con un front React + Vite, una API Express y un contrato OpenAPI del que se generan los hooks del cliente y los esquemas Zod.

## Enlaces

- **Web:** [conciergo-sigma.vercel.app](https://conciergo-sigma.vercel.app)
- **GitHub:** [Criscode2022/Concert-Connect](https://github.com/Criscode2022/Concert-Connect)
- **Salud de la API:** [`/api/healthz`](https://conciergo-sigma.vercel.app/api/healthz) responde `{"status":"ok"}`

## Stack

| Capa     | Tecnología                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| Web      | React 19.1, Vite 7, Tailwind CSS 4, componentes shadcn/ui (Radix), Wouter 3, TanStack Query 5, Framer Motion |
| Contrato | OpenAPI 3.1 (`lib/api-spec/openapi.yaml`); Orval genera los hooks de React Query y los esquemas Zod          |
| API      | Express 5 en Node, logs con pino; Socket.io para el chat cuando la API corre como servidor                   |
| Auth     | Neon Auth (Better Auth). La API verifica el JWT con `jose` contra el JWKS de Neon Auth                       |
| Datos    | Neon Postgres en Frankfurt (`eu-central-1`) con Drizzle ORM sobre `pg`                                       |
| Mapa     | Google Maps JavaScript API con marcadores avanzados                                                          |
| Deploy   | Vercel: el front como estáticos y la API como una sola función                                               |
| Monorepo | pnpm 11 con workspaces y catálogo de versiones, TypeScript 5.9, Node 22 o superior                           |

## En cifras

|                       |                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| Rutas del front       | 10: landing, acceso, eventos, mapa, nuevo bolo, ficha, conexiones, chat, perfil y perfil de otra persona |
| Operaciones de la API | 15 en el contrato OpenAPI                                                                                |
| Tablas                | 5: `users`, `events`, `event_attendees`, `matches`, `messages`                                           |
| Bolos en producción   | 6, en Madrid y Barcelona, uno por género (20 de octubre de 2026)                                         |
| Tests                 | Ninguno automatizado. Ver [Testing · visión](./12-testing.md)                                            |

## Historia

El proyecto nació en Replit en junio de 2026 con Clerk como login. En agosto pasó a Vercel y Neon Auth (`Replace Clerk and Replit with Neon Auth and Vercel`), y en septiembre la base de datos se movió a un proyecto Neon en Frankfurt. Quedan restos de Replit que no se despliegan: `artifacts/mockup-sandbox`, `attached_assets/` y `scripts/post-merge.sh`.

## Cómo leer esta documentación

| Documento                                        | Para                                                   |
| ------------------------------------------------ | ------------------------------------------------------ |
| [Producto y features](./02-product.md)           | Qué hace la app, pantalla por pantalla                 |
| [Arquitectura](./03-architecture.md)             | Cómo viaja una petición y cómo llega un mensaje        |
| [Estructura del workspace](./04-monorepo.md)     | Qué hay en cada paquete y qué comandos existen         |
| [Superficie API](./05-api.md)                    | Las 15 operaciones y el handshake del chat             |
| [Autenticación](./06-auth.md)                    | Del login de Neon Auth al usuario de la base de datos  |
| [Modelo de datos](./07-data-model.md)            | Tablas, borrados en cascada y cómo se crea el esquema  |
| [Deploy en Vercel](./08-deploy-vercel.md)        | Cómo llega `main` a producción y cómo se arranca local |
| [Decisiones](./09-decisions.md)                  | Por qué está hecho así                                 |
| [Retos y resultados](./10-challenges-results.md) | Lo que costó, lo que funciona y lo que falta           |
| [Front · React](./11-angular-skill.md)           | Las prácticas del cliente React                        |

La parte de testing empieza en [Testing · visión](./12-testing.md).
