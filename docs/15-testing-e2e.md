---
title: Testing · flujos completos
---

# Testing · flujos completos

No hay Playwright ni otra herramienta de navegador. Los flujos se recorren a mano en producción.

## Recorrido como invitado

1. `/`: el titular _«No dejes que un gran bolo se pierda»_ y los botones Entrar, Unirse y Explorar eventos.
2. `/events`: los bolos con sus géneros; tocar un género filtra la lista.
3. `/events/map`: un marcador por bolo; al tocarlo, su ficha con _Inicia sesión para apuntarte_.
4. `/events/:id`: la ficha completa con el número de asistentes.
5. La navegación solo enseña Eventos y Mapa.

## Recorrido con dos cuentas

Hacen falta dos navegadores (o una ventana privada) con cuentas distintas:

1. Cada cuenta se registra en `/auth/sign-up`; la primera petición crea su fila en `users`.
2. La cuenta A se apunta a un bolo. La B se apunta al mismo.
3. Las dos ven la conexión en `/matches` (como mucho 20 segundos después).
4. A escribe en el chat. B ve el mensaje al volver a la pestaña o al abrir el chat; en producción no llega al instante (ver [Arquitectura](./03-architecture.md#cómo-llega-un-mensaje)).
5. B se borra del bolo: la conexión desaparece para las dos y el chat ya no abre.

## Por qué no está automatizado

- El login real pasa por Neon Auth y Google; un test necesita cuentas de prueba y un proyecto de Neon Auth que no sea el de producción.
- El mapa necesita una clave de Google Maps con facturación.
- Producción tiene una sola base de datos: un test que se apunta a bolos dejaría conexiones reales.

## Cómo sería

Playwright contra la app en local (API con Socket.io y Vite), una rama de Neon nueva para cada ejecución y dos contextos de navegador con cuentas de prueba. El mapa se puede dejar fuera al principio: el flujo que importa es apuntarse, conectar y chatear.
