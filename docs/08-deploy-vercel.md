---
title: Deploy Vercel
---

# Deploy en Vercel

**Producción:** [conciergo-sigma.vercel.app](https://conciergo-sigma.vercel.app). Un solo proyecto de Vercel sirve la web y la API desde el mismo dominio, así que no hace falta CORS entre ellas.

## Qué hace Vercel con `main`

Todo está en `vercel.json`:

| Paso      | Configuración                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| Cuándo    | Solo los pushes a `main` despliegan; las previews de otras ramas están desactivadas (`git.deploymentEnabled`) |
| Instalar  | `pnpm install --frozen-lockfile`                                                                              |
| Compilar  | `pnpm --filter @workspace/conciergo run build && pnpm --filter @workspace/api-server run build`               |
| Estáticos | `artifacts/conciergo/dist/public`                                                                             |
| API       | `api/index.js` como función, con `artifacts/api-server/dist/**` incluido y hasta 30 segundos por petición     |
| Rutas     | `/api/:path*` → `/api/index`; cualquier otra ruta → `/index.html`, para que el router del cliente resuelva    |

`api/index.js` importa la app la primera vez y la guarda para las siguientes peticiones de la misma instancia. Si la importación falla (por ejemplo, por un módulo que falta en el bundle), responde 500 con `{"error":"API failed to start"}` y el motivo, en lugar de un error genérico de Vercel.

El build de Vercel no ejecuta el typecheck, así que un error de tipos no bloquea el deploy.

## Variables de entorno

| Variable                   | Lado  | Para                                                                                           |
| -------------------------- | ----- | ---------------------------------------------------------------------------------------------- |
| `DATABASE_URL`             | API   | La cadena de conexión de Neon, con pooling                                                     |
| `NEON_AUTH_BASE_URL`       | API   | El JWKS y el emisor de los tokens (`NEON_AUTH_URL` también vale)                               |
| `VITE_NEON_AUTH_URL`       | Front | El cliente de Neon Auth. Tiene un valor por defecto en `src/lib/auth.ts`                       |
| `VITE_GOOGLE_MAPS_API_KEY` | Front | La clave de Maps. Es pública por naturaleza: conviene restringirla por dominio en Google Cloud |
| `LOG_LEVEL`                | API   | Opcional, `info` por defecto                                                                   |

Las `VITE_*` se escriben en el JavaScript durante el build: cambiarlas exige un deploy nuevo.

La base de datos y Neon Auth son el proyecto Neon `concert-connect-eu`, en Frankfurt.

## Lo que no hay en Vercel

- **Socket.io.** Una función no mantiene conexiones abiertas, así que el chat no llega en vivo en producción; se ve al refrescar (ver [Arquitectura](./03-architecture.md#cómo-llega-un-mensaje)).
- **Migraciones en el deploy.** El esquema se aplica a mano con `drizzle-kit push` antes de desplegar código que lo necesite.

## En local

`.env.example` lista las variables, pero nada carga un `.env` de la raíz: la API lee `process.env` tal cual, y Vite solo lee los `.env` de `artifacts/conciergo`. Lo más simple es exportarlas en cada terminal:

```bash
pnpm install
# terminal 1: DATABASE_URL y NEON_AUTH_BASE_URL exportadas
pnpm --filter @workspace/api-server run dev   # API en :8080, con Socket.io
# terminal 2: VITE_NEON_AUTH_URL y VITE_GOOGLE_MAPS_API_KEY exportadas
pnpm --filter @workspace/conciergo run dev    # Vite en :5173
```

Vite redirige `/api` a `API_PROXY_TARGET` (`http://127.0.0.1:8080` por defecto). `PORT` y `BASE_PATH` cambian el puerto y la ruta base de la web. En local el chat sí es en vivo.
