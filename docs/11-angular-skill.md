---
title: Front · React
---

# Front · React

En los otros proyectos este documento repasa cómo se usa Angular. Conciergo es una app **React 19** con Vite, así que aquí se cuentan las prácticas de su cliente (`artifacts/conciergo`).

## Rutas

Wouter, con la ruta base de Vite (`BASE_PATH`) aplicada al router. Cada página es un `lazy()`; mientras carga, `RouteFallback` pinta el esqueleto del layout para que la navegación no parpadee. Una ruta desconocida cae en `NotFound`.

## Datos

- **Solo hooks generados.** Las páginas no llaman a `fetch`: usan los hooks de `@workspace/api-client-react` (`useListEvents`, `useAttendEvent`, `useSendMessage`…), tipados desde el contrato.
- **Un `QueryClient` con reglas propias:** 15 segundos de frescura, refresco al volver a la ventana y al reconectar, tres reintentos para un 401 y ninguno para el resto de 4xx.
- **Invalidación tras escribir.** Apuntarse o borrarse invalida eventos, fichas y conexiones de una vez con `invalidateAfterAttendance()`.
- **Conexiones vivas.** `useMatchesQuery()` repite la petición cada 20 segundos con la sesión abierta y conserva los datos anteriores mientras llega la respuesta, para que el badge no parpadee.

## Formularios

`react-hook-form` con `zodResolver`: el formulario de nuevo bolo valida en el cliente (campos obligatorios, URL de imagen válida) y enseña los errores junto a cada campo.

## Interfaz

- Componentes shadcn/ui sobre Radix en `src/components/ui`, con Tailwind 4 y una estética de cartel: bordes gruesos, sombras duras y tipografía serif en mayúsculas.
- Framer Motion para la entrada de tarjetas, mensajes y bloques que aparecen al apuntarse.
- `AppLayout` cambia entre barra lateral (escritorio) y barra inferior (móvil), y oculta Conexiones y Perfil a los invitados.
- La lista de eventos espera a que las imágenes de las tarjetas estén descargadas antes de quitar el esqueleto.

## Carga

`vite.config.ts` separa React, TanStack Query y Framer Motion en trozos propios. En el build del 20 de octubre de 2026 pesan 186 kB, 36 kB y 127 kB sin comprimir (59 kB, 11 kB y 42 kB con gzip). El mapa solo carga la API de Google en `/events/map`.
