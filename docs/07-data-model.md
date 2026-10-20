---
title: Modelo de datos
---

# Modelo de datos

Neon Postgres con Drizzle ORM. El esquema está en `lib/db/src/schema/`, una tabla por fichero. Todas usan un `serial` como clave y un `created_at` con la hora de inserción.

## `users`

| Columna        | Tipo     | Notas                                     |
| -------------- | -------- | ----------------------------------------- |
| `auth_id`      | `text`   | Único. El `sub` de la cuenta de Neon Auth |
| `name`         | `text`   | Obligatorio                               |
| `bio`          | `text`   |                                           |
| `avatar_url`   | `text`   | Viene de Neon Auth al crear la fila       |
| `music_genres` | `text[]` | Obligatorio, vacío por defecto            |
| `city`         | `text`   |                                           |

## `events`

| Columna              | Tipo               | Notas                            |
| -------------------- | ------------------ | -------------------------------- |
| `title`              | `text`             | Obligatorio                      |
| `artist_name`        | `text`             | Obligatorio                      |
| `venue_name`         | `text`             | Obligatorio                      |
| `venue_address`      | `text`             |                                  |
| `date`               | `timestamp`        | Obligatorio                      |
| `lat`, `lng`         | `double precision` | Obligatorios; los usa el mapa    |
| `genre`              | `text`             |                                  |
| `image_url`          | `text`             |                                  |
| `created_by_user_id` | `integer`          | → `users.id`, borrado en cascada |

## `event_attendees`

Quién va a qué bolo: `event_id` → `events.id` y `user_id` → `users.id`, los dos con borrado en cascada. Único por `(event_id, user_id)`, así que apuntarse dos veces no duplica nada.

## `matches`

Una conexión entre dos personas por un bolo: `event_id`, `user_id_1` y `user_id_2`, con `user_id_1` siempre menor que `user_id_2`. Único por `(event_id, user_id_1, user_id_2)`. Las tres claves ajenas borran en cascada.

## `messages`

`match_id` → `matches.id`, `sender_id` → `users.id` y `content`. Borrar una conexión borra su chat.

## Cascadas

```
users ─┬─► events ─┬─► event_attendees
       │           └─► matches ──► messages
       ├─► event_attendees
       ├─► matches
       └─► messages
```

Borrar a una persona borra los bolos que creó y, con ellos, las asistencias, conexiones y mensajes de todos los que iban. Antes de borrar una cuenta que ha creado bolos hay que pasarlos a otra persona.

## Fuera del esquema

- **`neon_auth."user"`.** La tabla de cuentas de Neon Auth, en la misma base de datos. La API solo la lee, para completar el nombre de una cuenta nueva (ver [Autenticación](./06-auth.md)).
- **Bolos iniciales.** Los seis bolos de producción los creó una cuenta de sistema (`auth_id = 'system-conciergo'`) directamente en la base de datos; no hay script de semilla en el repo. Las notas de `.agents/memory` piden no crear personas falsas: llenarían las conexiones de gente con la que nadie puede hablar.

## Cómo se aplica el esquema

No hay migraciones versionadas. `pnpm --filter @workspace/db run push` ejecuta `drizzle-kit push`, que compara el esquema de `lib/db` con la base de `DATABASE_URL` y aplica la diferencia. Existe también `push-force`, que no pide confirmación.

## Lo que devuelve la API

Las rutas no devuelven filas tal cual. Las convierten con `userToJson`, `eventToJson`, `messageToJson` y `enrichMatch`: fechas en ISO 8601, `null` explícito en los opcionales y campos calculados como `attendeesCount`, `isAttending`, `otherUser`, `lastMessage` o `unreadCount`.
