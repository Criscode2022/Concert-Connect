---
title: Testing · e2e
---

# Testing · e2e

No hay Playwright. El recorrido (landing → eventos → mapa → match → chat) se prueba a mano en el Repl.

## Por qué no está automatizado

- Clerk (login real) y Google Maps (key + billing) no caben en un CI anónimo.
- El preview Replit cambia de host (`*.spock.replit.dev`); un `baseURL` fijo se pudre.
- Presencia/Task Cloud sí tienen e2e porque su núcleo (offline, tabs) no pide OAuth.

## Recorrido manual mínimo

1. Landing signed-out: *«No dejes que un gran bolo se pierda»*.
2. Explorar `/events` y `/events/map` sin sesión.
3. Unirse (Clerk) → apuntarse a un evento → aparece match en Conexiones.
4. Chat: un mensaje, badge de no leído en el otro lado.
