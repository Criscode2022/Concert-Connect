---
title: Modelo de datos
---

# Modelo de datos (Drizzle / Postgres)

## `users`

`id`, `clerk_id` (único), `name`, `bio`, `avatar_url`, `music_genres[]`, `city`, `created_at`.

## `events`

`title`, `artist_name`, `venue_name`, `venue_address`, `date`, `lat`, `lng`, `genre`, `image_url`, `created_by_user_id`.

## `event_attendees`

Quién va a qué bolo. Al insertar, el servidor crea **matches** con el resto de asistentes.

## `matches`

`event_id` + `user_id_1` + `user_id_2` (unique). Un chat por pareja y evento.

## `messages`

Mensajes del match. El front cuenta `unreadCount` para el badge de Conexiones.
