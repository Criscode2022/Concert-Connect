---
title: Estructura del workspace
---

# Estructura del workspace

Un workspace pnpm (`pnpm-workspace.yaml`) con aplicaciones en `artifacts/` y librerías en `lib/`. Los nombres de paquete empiezan por `@workspace/`.

| Ruta                       | Paquete                       | Qué es                                                                                          |
| -------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `artifacts/conciergo`      | `@workspace/conciergo`        | La app React + Vite. Páginas en `src/pages`, layout en `src/components/layout`                  |
| `artifacts/api-server`     | `@workspace/api-server`       | La API Express: rutas, middlewares de auth, Socket.io y el build con esbuild                    |
| `api/index.js`             | —                             | La función de Vercel: importa `artifacts/api-server/dist/app.mjs`                               |
| `lib/api-spec`             | `@workspace/api-spec`         | `openapi.yaml` y la configuración de Orval                                                      |
| `lib/api-client-react`     | `@workspace/api-client-react` | Hooks de React Query generados, más `custom-fetch.ts` (base `/api`, token, errores)             |
| `lib/api-zod`              | `@workspace/api-zod`          | Esquemas Zod generados desde el mismo contrato                                                  |
| `lib/db`                   | `@workspace/db`               | Esquema Drizzle (`src/schema/`), el cliente `db` y `drizzle.config.ts`                          |
| `artifacts/mockup-sandbox` | `@workspace/mockup-sandbox`   | Sandbox de Replit para previsualizar componentes. No se despliega                               |
| `scripts`                  | `@workspace/scripts`          | `hello.ts` de ejemplo y `post-merge.sh` (instalar y aplicar el esquema tras un merge en Replit) |
| `attached_assets/`         | —                             | Imágenes adjuntadas en Replit, con alias `@assets` en Vite; ninguna página las importa          |
| `.agents/memory/`          | —                             | Notas para agentes: decisiones del stack y sistema de diseño                                    |
| `neon.ts`                  | —                             | Configuración de Neon para el proyecto: Neon Auth activado                                      |
| `docs/`                    | —                             | Esta documentación                                                                              |

## Comandos

| Comando                                         | Qué hace                                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm install`                                  | Instala todo. Un `preinstall` aborta si se usa npm o yarn                             |
| `pnpm --filter @workspace/api-server run dev`   | Compila la API y la arranca en `:8080` con Socket.io                                  |
| `pnpm --filter @workspace/conciergo run dev`    | Vite en `:5173`, con `/api` redirigido a la API local                                 |
| `pnpm run typecheck`                            | `tsc --build` de las librerías y `tsc --noEmit` de cada app y de `scripts`            |
| `pnpm run build`                                | El typecheck y después el build de cada paquete que lo tenga                          |
| `pnpm --filter @workspace/api-spec run codegen` | Regenera hooks y esquemas desde `openapi.yaml` y comprueba los tipos de las librerías |
| `pnpm --filter @workspace/db run push`          | Aplica el esquema Drizzle a la base de `DATABASE_URL` (`drizzle-kit push`)            |

`pnpm run build` falla hoy porque el typecheck de la web da 8 errores (ver [Testing · integración](./14-testing-integration.md)). Vercel no lo usa: su build llama directamente a los builds de la web y de la API.

## Ajustes del workspace

- **Catálogo de versiones.** React, Vite, Tailwind, TanStack Query, Drizzle, Zod y el resto de dependencias compartidas se declaran una vez en `catalog:` y los paquetes las piden con `"catalog:"`.
- **Antigüedad mínima.** `minimumReleaseAge: 1440` impide instalar una versión publicada hace menos de un día, como defensa ante paquetes comprometidos. `@neondatabase/*` y `jose` están exentos.
- **Builds permitidos.** Solo `esbuild`, `@swc/core`, `msw` y `unrs-resolver` pueden ejecutar scripts de instalación, y `esbuild` está fijado a 0.27.3 para todo el árbol.
- **Versiones de herramientas.** `packageManager: pnpm@11.21.0`, `engines.node >= 22`, TypeScript `~5.9.3`.
