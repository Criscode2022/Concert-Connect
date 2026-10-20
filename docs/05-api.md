---
title: Superficie API
---

# Superficie API

Base: `/api`. El contrato es `lib/api-spec/openapi.yaml` (OpenAPI 3.1, 15 operaciones); la implementación vive en `artifacts/api-server/src/routes/`.

**Acceso:** _pública_ no mira el token; _opcional_ lo usa si llega (para calcular `isAttending`); _sesión_ responde 401 sin un JWT válido.

## Salud

| Método | Ruta       | Acceso  | Respuesta            |
| ------ | ---------- | ------- | -------------------- |
| GET    | `/healthz` | pública | `{ "status": "ok" }` |

## Usuarios

| Método | Ruta             | Acceso | Qué hace                                                                           |
| ------ | ---------------- | ------ | ---------------------------------------------------------------------------------- |
| GET    | `/users/me`      | sesión | El perfil propio                                                                   |
| PUT    | `/users/me`      | sesión | Cambia solo los campos enviados: `name`, `bio`, `avatarUrl`, `musicGenres`, `city` |
| GET    | `/users/:userId` | sesión | El perfil de otra persona; 404 si no existe                                        |

## Eventos

| Método | Ruta                      | Acceso   | Qué hace                                                                                             |
| ------ | ------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| GET    | `/events`                 | opcional | Hasta 50 bolos por fecha descendente; `?genre=` filtra por género exacto                             |
| POST   | `/events`                 | sesión   | Crea un bolo y apunta a quien lo crea. 201                                                           |
| GET    | `/events/:eventId`        | opcional | Un bolo; 404 si no existe                                                                            |
| DELETE | `/events/:eventId`        | sesión   | Borra un bolo propio (403 si es de otra persona). La interfaz no lo usa                              |
| POST   | `/events/:eventId/attend` | sesión   | Apunta y crea una conexión con cada otra persona apuntada                                            |
| DELETE | `/events/:eventId/attend` | sesión   | Borra la asistencia y las conexiones de ese bolo, con sus mensajes. 204                              |
| GET    | `/events/stats`           | sesión   | Totales de bolos, personas y bolos futuros, y los cinco géneros con más bolos. La interfaz no lo usa |

Cada bolo se devuelve con `createdBy` (el perfil de quien lo creó), `attendeesCount` e `isAttending`.

## Conexiones y mensajes

| Método | Ruta                         | Acceso | Qué hace                                                                                      |
| ------ | ---------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| GET    | `/matches`                   | sesión | Tus conexiones, la más nueva primero, con `otherUser`, `event`, `lastMessage` y `unreadCount` |
| GET    | `/matches/:matchId`          | sesión | Una conexión; 404 si no existe y 403 si no es tuya                                            |
| GET    | `/matches/:matchId/messages` | sesión | El historial en orden cronológico; cada mensaje lleva `senderAuthId`                          |
| POST   | `/matches/:matchId/messages` | sesión | Envía un mensaje (400 si está vacío). 201, y lo emite por Socket.io si hay servidor           |

`unreadCount` cuenta todos los mensajes que te ha enviado la otra persona: no se guarda qué has leído.

## Chat en vivo (Socket.io)

Ruta: `/api/socket.io`. Solo existe cuando la API corre como servidor (en local); en Vercel responde 404 (ver [Arquitectura](./03-architecture.md#cómo-llega-un-mensaje)).

El cliente se conecta con `{ token, matchId }` en el handshake. El servidor verifica el JWT, busca al usuario y comprueba que la conexión es suya; si algo falla, rechaza el socket con `Invalid token`, `User not found` o `Forbidden`. Después une el socket a la sala `chat:<matchId>`, donde se emite `new_message` con el mismo JSON que devuelve el `POST`.

## La regla de las conexiones

`POST /events/:eventId/attend` guarda la asistencia y recorre al resto de asistentes. Cada pareja se guarda con el id menor primero, y la restricción única `(event_id, user_id_1, user_id_2)` hace que repetir la llamada no duplique nada:

```ts
for (const attendee of otherAttendees) {
  const u1 = Math.min(user.id, attendee.userId);
  const u2 = Math.max(user.id, attendee.userId);
  await db
    .insert(matchesTable)
    .values({ eventId, userId1: u1, userId2: u2 })
    .onConflictDoNothing();
}
```

## Errores

Todas las rutas responden errores como `{ "error": "<mensaje>" }`. Un error sin capturar lo recoge el último middleware de `app.ts` con un 500.

El contrato tipa el cliente, pero el servidor solo pasa por Zod la respuesta de `/healthz`: los cuerpos de `POST` y `PUT` se leen sin validar.
