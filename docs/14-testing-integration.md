---
title: Testing · integración
---

# Testing · integración

No hay tests de integración que hagan peticiones HTTP. La integración que sí se comprueba es la de **los tipos**: que el contrato, el código generado, la API y las páginas encajan.

## La cadena del contrato

```bash
pnpm --filter @workspace/api-spec run codegen
pnpm run typecheck
```

1. Orval lee `lib/api-spec/openapi.yaml` y regenera `lib/api-client-react/src/generated` y `lib/api-zod/src/generated`.
2. `tsc --build` compila las librerías (`db`, `api-zod`, `api-client-react`).
3. `tsc --noEmit` compila cada app (`conciergo`, `api-server`, `mockup-sandbox`) y `scripts`.

Si una página usa un campo que el contrato ya no tiene, el paso 3 falla. Si cambia una respuesta en el contrato y no se regenera, los tipos generados no coinciden con lo que usan las páginas.

## Estado a 20 de octubre de 2026

| Paquete                    | Resultado     |
| -------------------------- | ------------- |
| Librerías (`tsc --build`)  | Sin errores   |
| `artifacts/api-server`     | Sin errores   |
| `artifacts/mockup-sandbox` | Sin errores   |
| `scripts`                  | Sin errores   |
| `artifacts/conciergo`      | **8 errores** |

Los 8 errores de la web tienen tres causas:

| Errores | Dónde                               | Causa                                                                                                                  |
| ------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 3       | `chat.tsx` (2) y `user-profile.tsx` | Los hooks generados piden `queryKey` cuando se les pasan opciones de consulta, y esas páginas pasan solo `{ enabled }` |
| 4       | `event-map.tsx`                     | No están instalados los tipos de Google Maps (`@types/google.maps`), así que `google.maps` no existe para TypeScript   |
| 1       | `event-map.tsx`                     | `setOptions({ key, version: "weekly" })`: la versión 2 del loader ya no acepta `version`                               |

Ninguno rompe el build: Vite compila sin comprobar tipos y Vercel no ejecuta `typecheck`. Pero `pnpm run build`, que empieza por el typecheck, sí falla.

## Lo que el typecheck no ve

- **El servidor no valida lo que recibe.** Los tipos del cliente garantizan que el front envía bien los cuerpos, pero la API no los pasa por los esquemas Zod. Una petición hecha a mano con campos raros llega a Drizzle tal cual.
- **Nada ejecuta SQL.** Que una consulta de Drizzle compile no dice que devuelva lo esperado.

## Un primer test de integración

`app.ts` exporta la app sin abrir un puerto, así que Supertest puede llamarla directamente. Con una rama de Neon creada para cada ejecución (o un Postgres local) y un JWKS de prueba con su propia clave, el primer caso sería el corazón del producto: dos personas se apuntan al mismo bolo y `GET /matches` devuelve una conexión para cada una; si una se borra, la conexión y sus mensajes desaparecen.
