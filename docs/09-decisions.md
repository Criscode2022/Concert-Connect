---
title: Decisiones de producto y tech
---

# Decisiones

## Match automático, no swipe

Apuntarse a un evento **es** el gesto de matching. Evita un segundo feed tipo dating.

## Socket.io para el chat

El historial sigue en REST; los mensajes en vivo van por Socket.io con el JWT de Neon Auth.

## OpenAPI como fuente de verdad

Orval genera hooks y Zod. El typecheck del workspace pilla desvíos entre front y API.

## Neon Auth, no Clerk

Email/social y sesión los resuelve Neon Auth (Better Auth). El dominio de negocio es el perfil y los matches (`users.auth_id`).

## Invitados ven el cartel

Eventos + mapa sin login para que el landing no sea un muro. Crear y chatear sí piden cuenta.
