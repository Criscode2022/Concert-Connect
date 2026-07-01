# ConcierGo

App web mobile-first para conectar personas que quieren ir a conciertos pero no tienen con quien ir. Incluye login con Clerk, mapa con Google Maps, chat entre usuarios emparejados y feed de eventos.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server
- `pnpm --filter @workspace/conciergo run dev` — Frontend React+Vite
- `pnpm run typecheck` — full typecheck
- `pnpm --filter @workspace/api-spec run codegen` — regenerar hooks y Zod schemas
- `pnpm --filter @workspace/db run push` — aplicar cambios de schema a DB (dev)
- Required env: `DATABASE_URL`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_GOOGLE_MAPS_API_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind v4, Framer Motion, Wouter, shadcn/ui
- Auth: Clerk (Replit-managed) via `@clerk/react` + `@clerk/express`
- Maps: Google Maps JavaScript API via `@googlemaps/js-api-loader`
- API: Express 5 + Clerk middleware
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `lib/api-spec/openapi.yaml` — fuente de verdad de todos los contratos API
- `lib/db/src/schema/` — schema Drizzle (users, events, event_attendees, matches, messages)
- `artifacts/api-server/src/routes/` — rutas Express (users, events, matches)
- `artifacts/api-server/src/middlewares/requireAuth.ts` — middleware Clerk + JIT user provisioning
- `artifacts/conciergo/src/pages/` — páginas React (home, events, event-map, event-new, event-detail, matches, chat, profile)
- `artifacts/conciergo/src/components/layout/app-layout.tsx` — layout con sidebar desktop + bottom nav mobile
- `artifacts/conciergo/public/logo.svg` — logo SVG generado

## Architecture decisions

- **Match automático**: cuando un usuario marca asistencia a un evento, se crea automáticamente un match con todos los demás asistentes. El match genera un chat 1-1.
- **Chat por polling**: los mensajes se refrescan cada 3 segundos via React Query `refetchInterval` — no WebSocket para simplificar el deployment.
- **JIT user provisioning**: el middleware `requireAuth` crea el usuario en DB la primera vez que llama a la API, extrayendo nombre y avatar de los claims de Clerk.
- **Clerk proxy**: montado en `/api/__clerk` vía `clerkProxyMiddleware` para que el mismo build funcione en dev y prod sin cambios.
- **Google Maps**: cargado dinámicamente con `@googlemaps/js-api-loader` usando la API key desde `VITE_GOOGLE_MAPS_API_KEY`.

## Product

- Feed de conciertos: buscar por género, marcar que quieres ir, crear nuevos eventos con búsqueda de venue por Google Places
- Mapa interactivo: todos los conciertos como pins en Google Maps, click para ver detalles y apuntarse
- Matching automático: al apuntarse a un evento, te emparejas con todos los demás asistentes
- Chat 1-1 por match: conversación privada sobre el concierto
- Perfil: nombre, ciudad, géneros favoritos, foto de Clerk

## User preferences

- Idioma de la app: español
- Diseño: oscuro, eléctrico, música-first — no sobrecargado

## Gotchas

- Siempre re-ejecutar codegen (`pnpm --filter @workspace/api-spec run codegen`) tras cambiar el spec OpenAPI
- La Google Maps API key debe tener activadas "Maps JavaScript API" y "Places API"
- El chat usa polling (no WebSocket) — no añadir rutas WS sin actualizar el artifact.toml

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
