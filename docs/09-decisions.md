---
title: Decisiones de producto y tech
---

# Decisiones

## Apuntarse es el match

No hay un segundo feed para valorar personas. Si dos personas van al mismo bolo, quedan conectadas. Es menos incómodo que una app de citas y el chat empieza con un tema de conversación: el concierto.

## Borrarse quita el chat

Al dejar de ir, se borran tus conexiones de ese bolo y sus mensajes. La regla es que solo chatea quien va; mantener conexiones de alguien que ya no asiste dejaría chats con gente que no estará allí. Como las rutas del chat comprueban que la conexión existe, no hace falta revisar la asistencia en cada mensaje.

## El cartel es público

Eventos, mapa y fichas se ven sin cuenta (`optionalAuth`). La landing no es un muro: quien llega ve primero qué conciertos hay, y la cuenta se pide al apuntarse.

## El contrato manda

`openapi.yaml` es la fuente de los tipos: Orval genera los hooks del front y los esquemas Zod, y las páginas solo llaman a la API a través de esos hooks. Cambiar una respuesta obliga a tocar el contrato, regenerar y compilar. El servidor aún no valida con Zod lo que recibe; hoy el contrato protege sobre todo al cliente.

## Neon Auth en lugar de Clerk

La primera versión, en Replit, usaba Clerk. Al pasar a Vercel en agosto de 2026, el login pasó a Neon Auth: las cuentas viven en la misma base de datos que el producto y la API solo necesita el JWKS para verificar tokens. La fila de `users` se crea en el primer uso, sin webhook.

## La app Express separada del servidor

`app.ts` exporta la app y `index.ts` la escucha con Socket.io. Así una función de Vercel puede importar la app sin abrir un puerto. El coste está asumido: en producción no hay chat en vivo.

## Base de datos perezosa

El pool de Postgres se crea en la primera consulta. Una instancia nueva de la función que solo atiende `/api/healthz` arranca sin tocar la base de datos.

## Instalaciones con un día de margen

`minimumReleaseAge: 1440` hace que pnpm rechace versiones publicadas hace menos de 24 horas. La mayoría de paquetes maliciosos se retiran antes de ese plazo.

## Solo `main` despliega

Las previews de Vercel están desactivadas. Solo hay una base de datos y un proyecto de Neon Auth, así que una preview trabajaría sobre los datos de producción.
