---
title: Autenticación Clerk
---

# Autenticación (Clerk)

## Flujo

1. Landing → Entrar / Unirse (`@clerk/react`).
2. El front habla con Clerk vía proxy `/api/__clerk` (mismo host en Replit).
3. Las rutas protegidas usan `requireAuth`:
   - Sin `userId` → 401.
   - Primera llamada → `INSERT` en `users` (nombre + avatar de Clerk).
4. Invitados ven Eventos y Mapa; Conexiones/Perfil/crear evento piden sesión.

## Por qué proxy

En `.replit.app` y custom domains, el proxy evita problemas de cookies de Clerk entre orígenes.

## Qué no hay

No hay PIN ni JWT propio (eso es Task Cloud). La sesión es de Clerk; la fila de negocio es `users.clerk_id`.
