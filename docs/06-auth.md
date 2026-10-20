---
title: Autenticación Neon Auth
---

# Autenticación

Las cuentas son de **Neon Auth** (Better Auth gestionado por Neon). La app no guarda contraseñas ni sesiones propias: su tabla `users` enlaza cada cuenta por `auth_id` y guarda solo el perfil musical.

## Del login al usuario de la base de datos

1. **Login.** `/auth/sign-in` y `/auth/sign-up` pintan `AuthView` de `@neondatabase/auth-ui` dentro de `NeonAuthUIProvider`: email y contraseña o Google, nombre obligatorio al registrarse y recuperación de contraseña. La sesión queda en una cookie de Neon Auth (`credentials: "include"`).
2. **JWT.** Antes de cada petición a la API, `getAccessToken()` (`src/lib/auth.ts`) busca un JWT en este orden y se queda con el primero válido:
   1. la cabecera `set-auth-jwt` de la respuesta de `getSession()`;
   2. el token de la sesión, si ya es un JWT;
   3. `authClient.token()`;
   4. `GET <Neon Auth>/token`.
3. **Verificación.** La API lee `Authorization: Bearer` y verifica el token con `jose` contra `<NEON_AUTH_BASE_URL>/.well-known/jwks.json`, exigiendo que el emisor sea el origen de esa URL. El JWKS se descarga una vez y se reutiliza.
4. **Alta en el primer uso.** `provisionUser()` busca la fila con `auth_id = sub`. Si no existe, la crea con el nombre y el avatar del token.

## El nombre de una cuenta nueva

El token no siempre trae el nombre. `profileFromPayload()` prueba en este orden: el claim `name`, la parte del email antes de la `@` y, si no hay nada, `"Usuario"`. Cuando el resultado es `"Usuario"`, `provisionUser()` consulta la tabla `neon_auth."user"`, que Neon Auth mantiene en la misma base de datos, y toma de ahí nombre e imagen. Si una petición posterior trae un nombre mejor o un avatar que faltaba, actualiza la fila.

## Invitados

`GET /events` y `GET /events/:eventId` usan `optionalAuth`: con un token válido identifican a la persona y calculan `isAttending`; sin él, o con uno inválido, siguen como invitado. El resto de rutas usan `requireAuth`.

En el front, las pantallas de invitado no muestran Conexiones ni Perfil, y los botones de apuntarse llevan a iniciar sesión.

## El chat

El handshake de Socket.io lleva el mismo JWT y el id de la conexión. El servidor lo verifica igual que una petición HTTP y además comprueba que la persona es una de las dos de esa conexión antes de unirla a la sala.

## Al cerrar sesión o cambiar de cuenta

`authClient.signOut()` cierra la sesión y la app vuelve a la landing. Si en la misma pestaña entra otra cuenta, `AuthQueryClientCacheInvalidator` vacía la caché de TanStack Query para que no queden datos de la anterior.

## Configuración

| Variable                                 | Dónde | Para                                                                                          |
| ---------------------------------------- | ----- | --------------------------------------------------------------------------------------------- |
| `NEON_AUTH_BASE_URL` (o `NEON_AUTH_URL`) | API   | JWKS y emisor esperado. Sin ella, las rutas protegidas responden 401                          |
| `VITE_NEON_AUTH_URL`                     | Front | El cliente de Neon Auth. Si falta, usa la URL del proyecto de producción escrita en el código |

Los logs de pino ocultan `Authorization` y las cookies de cada petición.
