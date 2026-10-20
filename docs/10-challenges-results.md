---
title: Retos y resultados
---

# Retos y resultados

## Retos

### Salir de Replit

El proyecto nació en Replit con Clerk. El 16 y 17 de agosto de 2026 pasó a Vercel y Neon Auth: la API se separó en una app importable para la función, el login se rehízo con `@neondatabase/auth-ui` y hubo que arreglar el envío del JWT para que apuntarse, las conexiones y el perfil funcionaran con la nueva sesión. Después se limitó el deploy a `main` para que las previews dejaran de publicarse.

### Sacar un JWT de Neon Auth

La sesión de Neon Auth vive en una cookie, pero la API necesita un JWT en la cabecera. El SDK puede entregar ese token por varias vías, así que `getAccessToken()` prueba cuatro fuentes por orden (ver [Autenticación](./06-auth.md)) y la caché reintenta los 401 mientras el token llega.

### Cuentas sin nombre

El JWT de una cuenta recién creada puede no traer el nombre, y las primeras conexiones salían como «Usuario». La API lee entonces la tabla `neon_auth."user"` y corrige el nombre en cuanto lo tiene.

### Google Maps

La versión 2 de `@googlemaps/js-api-loader` quitó la clase `Loader`; ahora se usan `setOptions({ key })` e `importLibrary()`. Los marcadores avanzados exigen un `mapId` (la app usa `DEMO_MAP_ID`), y sin las APIs activadas en Google Cloud el mapa enseña el aviso de Google en lugar de los bolos.

### Conexiones que sobrevivían

Al principio, borrarse de un bolo dejaba vivas las conexiones y se podía seguir chateando. Ahora se borran con la asistencia y la cascada se lleva los mensajes.

## Lo que falta

| Hueco                         | Efecto                                                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Sin Socket.io en Vercel       | En producción los mensajes llegan al refrescar, no al momento                                               |
| Contador de mensajes          | `unreadCount` cuenta todos los mensajes recibidos; no hay estado de leído, así que nunca baja               |
| Bolos sin ubicación           | El formulario envía `lat: 0, lng: 0`: un bolo creado desde la app no sale en el mapa de España              |
| Sin validación en el servidor | Los cuerpos de `POST` y `PUT` no pasan por los esquemas Zod                                                 |
| Tipos rotos en la web         | `pnpm run typecheck` da 8 errores en `artifacts/conciergo` (ver [integración](./14-testing-integration.md)) |
| Sin tests automatizados       | Ver [Testing · visión](./12-testing.md)                                                                     |
| Endpoints sin interfaz        | `DELETE /events/:id` y `GET /events/stats` existen pero ninguna pantalla los usa                            |

## Resultados

- La app está en producción con seis bolos en Madrid y Barcelona, login con email o Google y el ciclo completo: ver el cartel, apuntarse, conectar y chatear.
- El workspace se lee en orden: contrato → código generado → API Express → páginas React. Un cambio en una respuesta se ve en el contrato antes que en el código.
- Las páginas se cargan por separado y las dependencias grandes van en trozos propios, así que la landing no descarga el mapa ni el chat.
