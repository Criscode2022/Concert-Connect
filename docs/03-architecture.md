---
title: Arquitectura
---

# Arquitectura

## Vista general

```
Navegador · SPA React (Vite)
  │  sesión de Neon Auth (cookie) ──► Neon Auth: login, Google, JWT
  │  hooks de Orval + Bearer JWT
  ▼
Vercel
  ├─ estáticos: artifacts/conciergo/dist/public
  └─ /api/* ──► función api/index.js ──► app Express (dist/app.mjs)
                    │  requireAuth / optionalAuth: JWT verificado con el JWKS
                    ▼
               Neon Postgres (Drizzle + pg)
               users · events · event_attendees · matches · messages
```

El mapa carga la Google Maps JavaScript API directamente desde el navegador.

## Cómo viaja una petición

1. **Hook generado.** Una página llama a un hook de `@workspace/api-client-react`, por ejemplo `useAttendEvent()`. Orval lo genera desde `openapi.yaml`.
2. **Token.** El `customFetch` del paquete pide el token a `getAccessToken()` (registrado con `setAuthTokenGetter`) y añade `Authorization: Bearer <jwt>`. Sin sesión, la petición sale sin cabecera.
3. **Vercel.** La regla `/api/:path*` → `/api/index` manda la petición a la función, que importa la app Express ya compilada y la reutiliza entre peticiones.
4. **Middleware.** `requireAuth` verifica el JWT y responde 401 si falta o no vale; `optionalAuth` deja pasar a los invitados. Los dos crean el usuario en la tabla `users` la primera vez que lo ven (ver [Autenticación](./06-auth.md)).
5. **Ruta.** La ruta consulta Drizzle y da forma a la respuesta con funciones como `eventToJson` o `userToJson`: fechas en ISO, nulos explícitos y campos calculados (`attendeesCount`, `isAttending`, `unreadCount`).
6. **Caché.** TanStack Query guarda la respuesta. Tras apuntarse o borrarse, `invalidateAfterAttendance()` invalida eventos y conexiones para que la siguiente pantalla no enseñe datos viejos.

## Dos formas de arrancar la API

`artifacts/api-server/build.mjs` compila con esbuild dos entradas:

| Fichero          | Qué es                                       | Dónde se usa                                                |
| ---------------- | -------------------------------------------- | ----------------------------------------------------------- |
| `dist/app.mjs`   | Solo la app Express, sin `listen`            | La función de Vercel (`api/index.js`)                       |
| `dist/index.mjs` | Servidor HTTP en `PORT` (8080) con Socket.io | En local, con `pnpm --filter @workspace/api-server run dev` |

Separar la app del servidor es lo que permite meter Express en una función. El precio es el chat en vivo: Socket.io necesita un servidor que siga abierto, y en Vercel no lo hay.

## Cómo llega un mensaje

1. El cliente envía `POST /api/matches/:matchId/messages`.
2. La API comprueba que la persona pertenece a la conexión, guarda el mensaje y llama a `broadcastMessage()`.
3. **En local**, Socket.io emite `new_message` a la sala `chat:<matchId>` y el otro navegador lo añade a la caché al instante.
4. **En Vercel** no hay servidor de Socket.io (`/api/socket.io` responde 404), así que `broadcastMessage()` no hace nada. El otro lado ve el mensaje cuando su caché se refresca: al volver a la pestaña, al reconectar o al abrir el chat. La lista de conexiones se vuelve a pedir cada 20 segundos.

## Estado en el cliente

- **Sesión:** la gestiona el cliente de Neon Auth (`authClient.useSession()`).
- **Datos:** todo pasa por TanStack Query. Por defecto, los datos valen 15 segundos, se refrescan al volver a la ventana y al reconectar, un 401 se reintenta hasta tres veces (el token puede estar llegando) y el resto de errores 4xx no se reintenta.
- **Cambio de cuenta:** `AuthQueryClientCacheInvalidator` vacía la caché cuando una sesión abierta se cierra o cambia de usuario, para que nadie vea las conexiones de la cuenta anterior.

## Base de datos

`lib/db` exporta `db` como un `Proxy`: el pool de `pg` (máximo 5 conexiones) se crea en la primera consulta. Así importar el paquete no exige `DATABASE_URL`, y una función de Vercel que solo responde `/api/healthz` no abre conexiones.

## Carga del front

Cada página es un `lazy()` con su `Suspense`, y Vite separa en trozos propios React, TanStack Query y Framer Motion. La primera visita a la landing no descarga el mapa, el chat ni el formulario.
