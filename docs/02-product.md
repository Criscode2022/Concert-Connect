---
title: Producto y features
---

# Producto y features

## Problema

Un concierto al que te apetece ir se queda en nada si nadie de tu entorno se apunta. Los grupos de mensajería no conectan a desconocidos que tienen el mismo plan, y las apps de citas no van de música.

## Solución

En Conciergo, apuntarse a un bolo es el gesto que conecta: la app te empareja con cada persona que también va y os abre un chat para quedar antes, compartir el viaje o guardar sitio delante.

## Quién la usa

- **Sin cuenta:** mira el cartel, el mapa y la ficha de cada bolo. El botón de apuntarse le pide iniciar sesión.
- **Con cuenta:** se apunta y se borra de bolos, añade bolos nuevos, chatea con sus conexiones y edita su perfil.

La interfaz está en español, y las fechas también (`date-fns` con locale `es`).

## Pantallas

### Landing (`/`)

Titular de cartel, _«No dejes que un gran bolo se pierda»_, y tres salidas: Entrar, Unirse y Explorar eventos. Con la sesión abierta, redirige a `/events`.

### Acceso (`/auth/sign-in`, `/auth/sign-up`)

Las vistas de `@neondatabase/auth-ui` con el estilo de la app: email y contraseña o Google, nombre obligatorio al registrarse y recuperación de contraseña. Al entrar, lleva a `/events`. `/sign-in` y `/sign-up` redirigen aquí.

### Eventos (`/events`)

Los bolos ordenados por fecha descendente, el más tardío primero (la API devuelve hasta 50). Cada tarjeta enseña artista, recinto, fecha y asistentes, con el botón de apuntarse. Encima, chips de género construidos con los géneros de los bolos cargados; tocar uno filtra la lista, y tocar el género de una tarjeta hace lo mismo. Mientras llegan los datos y las imágenes se ve un esqueleto, para que la lista no salte. Con sesión, un botón flotante lleva a añadir un bolo.

### Mapa (`/events/map`)

Google Maps centrado en Madrid con zoom de país, un marcador por bolo. Al tocar uno se abre su ficha resumida con el botón de apuntarse o cancelar. Si falta la clave de Maps, la página lo dice en lugar de romperse.

### Nuevo bolo (`/events/new`)

Formulario con validación Zod: título, artista, recinto y fecha obligatorios; género y URL de imagen opcionales. Quien crea el bolo queda apuntado. El formulario no pide la ubicación y envía `lat: 0` y `lng: 0`, así que un bolo creado desde la app no sale en el mapa de España (ver [Retos y resultados](./10-challenges-results.md)).

### Ficha de un bolo (`/events/:id`)

Datos del bolo, número de asistentes y el botón _Apuntarme al bolo_ / _Apuntado · Cancelar_. Al apuntarte aparece el bloque _Tus Compañeros_. Sin sesión, el botón dice _Inicia sesión para apuntarte_.

### Conexiones (`/matches`)

Una fila por persona y bolo, con su avatar, su nombre, el artista, el último mensaje con su hora y un contador de mensajes recibidos. La lista se vuelve a pedir cada 20 segundos y la suma de los contadores sale como badge en la navegación. Sin conexiones, la pantalla dice _«El backstage está vacío»_.

### Chat (`/matches/:matchId`)

Cabecera con el bolo, mensajes con su hora y un campo que envía con Intro. Un chat vacío invita a romper el hielo.

### Perfil (`/profile`) y perfil de otra persona (`/profile/:userId`)

El perfil propio edita nombre, bio, ciudad y géneros favoritos (16 para elegir); el avatar viene de la cuenta de Neon Auth, y desde aquí se cierra la sesión. El de otra persona, _Backstage de…_, enseña su avatar, ciudad, bio y géneros.

## Reglas

- **Apuntarse crea las conexiones:** una por cada otra persona apuntada al mismo bolo. Una pareja tiene una sola conexión por bolo.
- **Borrarse las quita:** al dejar de ir, se borran tus conexiones de ese bolo y, con ellas, sus mensajes. Solo chatea quien sigue apuntado.
- **El chat es privado:** solo las dos personas de una conexión pueden leerlo o escribir en él.
- **Navegación:** barra lateral en escritorio y barra inferior en el móvil. Sin sesión solo se ven Eventos y Mapa.
