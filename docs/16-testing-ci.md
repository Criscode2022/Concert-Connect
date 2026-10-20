---
title: Testing · CI
---

# Testing · CI

No hay ningún workflow que compile o pruebe el código. El único fichero en `.github/workflows` es `portfolio-docs.yml`, que pide al portfolio que se reconstruya cuando cambia `docs/`.

## Lo que hace de puerta hoy

El build de Vercel en cada push a `main`. Si Vite o esbuild no pueden compilar, el deploy falla y producción sigue con la versión anterior. Un error de tipos no lo para, porque ese build no ejecuta `tsc`.

## Un primer workflow

Sin secretos ni base de datos, solo con lo que ya existe:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run typecheck
```

`pnpm/action-setup` toma la versión de pnpm de `packageManager`. El job fallaría hoy por los 8 errores de la web (ver [integración](./14-testing-integration.md)): arreglarlos es el paso previo.

## Después

Cuando existan tests unitarios, un paso más en el mismo job. Los de integración y los flujos completos necesitarían una rama de Neon por ejecución y cuentas de prueba de Neon Auth guardadas como secretos.
