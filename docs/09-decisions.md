---
title: Decisiones de producto y tech
---

# Decisiones

## Match automático, no swipe

Apuntarse a un evento **es** el gesto de matching. Evita un segundo feed tipo dating.

## Polling frente a WebSocket

3 s con React Query. Suficiente para cuadrar un bolo; el deploy Replit no necesita un proceso WS aparte.

## OpenAPI como fuente de verdad

Orval genera hooks y Zod. El typecheck del workspace pilla desvíos entre front y API.

## Clerk, no auth casera

Email/social y sesión los resuelve Clerk. El dominio de negocio es el perfil y los matches.

## Invitados ven el cartel

Eventos + mapa sin login para que el landing no sea un muro. Crear y chatear sí piden cuenta.
