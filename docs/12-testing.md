---
title: Testing · visión
---

# Testing · visión

Conciergo **no tiene tests automatizados**: no hay Vitest, Jest ni Playwright instalados y no hay ficheros `*.spec.*` ni `*.test.*`. Lo que se comprueba hoy es el **typecheck del workspace**, la cadena del **contrato OpenAPI** y un **recorrido a mano** por la app.

Estado a 20 de octubre de 2026:

| Capa                                            | Herramienta             | Qué comprueba                                        | Estado                                                   |
| ----------------------------------------------- | ----------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| [Unitarios](./13-testing-unit.md)               | —                       | —                                                    | No hay                                                   |
| [Tipos y contrato](./14-testing-integration.md) | `tsc` y Orval           | Que contrato, código generado, API y páginas encajan | Librerías, API y `scripts` pasan; la web da 8 errores    |
| [Flujos completos](./15-testing-e2e.md)         | A mano, en el navegador | Cartel, mapa, apuntarse, conexiones y chat           | Sin automatizar                                          |
| [CI](./16-testing-ci.md)                        | —                       | —                                                    | No hay workflow de tests; Vercel no ejecuta el typecheck |

## Comandos

```bash
pnpm install
pnpm run typecheck                               # tsc de librerías, apps y scripts
pnpm --filter @workspace/api-spec run codegen    # regenera desde openapi.yaml y compila las librerías
```

## Por dónde empezar

El código tiene piezas fáciles de probar sin red. Cada documento de esta sección señala las que tocaría primero:

1. **Unitarios** de las funciones puras de la API: `profileFromPayload`, `readBearerToken` y la regla de parejas de las conexiones.
2. **Integración HTTP** con Supertest sobre `app` (se puede importar sin abrir un puerto) y una rama de Neon para cada ejecución.
3. **Un flujo completo** con Playwright: dos cuentas de prueba que se apuntan al mismo bolo y se escriben.
4. **Un workflow** que ejecute el typecheck en cada push, una vez arreglados los 8 errores.
