---
title: Testing · unitarios
---

# Testing · unitarios

No hay tests unitarios ni un runner instalado. Estas son las piezas que no necesitan base de datos ni red y que serían las primeras en tenerlos.

## El perfil que sale de un token

`profileFromPayload()` (`artifacts/api-server/src/lib/neonAuth.ts`) decide el nombre y el avatar de una cuenta nueva. Es una función pura sobre el payload del JWT:

```ts
const name = nameFromClaim || (email ? email.split("@")[0] : "") || "Usuario";
const avatarUrl =
  typeof payload.image === "string"
    ? payload.image
    : typeof payload.picture === "string"
      ? payload.picture
      : null;
```

Casos que valdría la pena fijar: nombre con espacios alrededor, sin nombre pero con email, sin nada (`"Usuario"`), y `image` frente a `picture`.

## La cabecera `Authorization`

`readBearerToken()` devuelve el token o `null`. Casos: sin cabecera, otro esquema (`Basic …`), `Bearer` sin token y un token con espacios.

## La regla de las conexiones

Al apuntarse, cada pareja se guarda con el id menor primero para que la restricción única la reconozca venga de quien venga:

```ts
const u1 = Math.min(user.id, attendee.userId);
const u2 = Math.max(user.id, attendee.userId);
```

Hoy vive dentro de la ruta. Sacarla a una función (`pairFor(a, b)`) permitiría probar que `pairFor(7, 3)` y `pairFor(3, 7)` dan lo mismo.

## En el front

- `getAccessToken()` y `extractJwt()` (`src/lib/auth.ts`): qué fuente gana cuando hay varias, y que un valor que no es un JWT no se envía.
- La política de reintentos del `QueryClient`: tres veces un 401, ninguna un 404.

## Con qué

Vitest encaja con el resto del workspace (Vite y ESM) y no necesita navegador para estas funciones.
