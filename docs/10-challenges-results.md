---
title: Retos y resultados
---

# Retos y aprendizajes

## Google Maps Loader

La API clásica `Loader` de `@googlemaps/js-api-loader` v2 ya no existe (`setOptions` + `importLibrary`). Un preview Replit llegó a mostrar el overlay rojo de Vite. Hay que alinear la versión del loader con el código.

## Keys de Maps

Sin Maps JS + Places activados, el mapa enseña *«This page can't load Google Maps correctly»*. Es configuración de GCP, no de UI.

## JIT user vs “Anonymous”

Si Clerk aún no ha enviado el nombre, el primer insert queda como Anonymous. `requireAuth` reintenta actualizar el perfil.

## Resultado

Un workspace que se entiende: spec → codegen → Express → React. El producto (compañía para un bolo) cabe en cuatro tabs.
