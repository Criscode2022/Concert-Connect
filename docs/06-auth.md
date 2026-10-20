---
title: Autenticación Neon Auth
---

# Autenticación (Neon Auth)

## Flujo

1. Landing → Entrar / Unirse (`@neondatabase/neon-js` + Better Auth, UI de `@neondatabase/auth-ui`).
2. El front pide un JWT (`getAccessToken`) y lo manda como `Authorization: Bearer`.
3. Las rutas protegidas usan `requireAuth`:
   - Sin token o JWT inválido → 401.
   - Primera llamada → `INSERT` en `users` (`auth_id` = `sub`, nombre + avatar del payload).
4. Invitados ven Eventos y Mapa; Conexiones/Perfil/crear evento piden sesión.

## Cómo se verifica

La API usa `jose` y el JWKS de Neon Auth (`NEON_AUTH_BASE_URL/.well-known/jwks.json`). El chat Socket.io valida el mismo token.

## Qué no hay

No hay Clerk ni PIN. La sesión es de Neon Auth; la fila de negocio es `users.auth_id`.
