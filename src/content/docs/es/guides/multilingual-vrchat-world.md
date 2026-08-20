---
title: "Hacer multilingüe un mundo de VRChat"
description: "Cómo traducir los textos y las imágenes de un mundo de VRChat, por qué los arrays paralelos acaban rompiéndose, y cómo recordar el idioma de un visitante entre visitas."
sidebar:
  order: 3
---

**Respuesta corta:** mantén todos los idiomas de una misma cadena en una sola fila, no en
arrays separados, y guarda la elección del jugador para que no tenga que repetirla.

## Por qué se pudren casi todos los sistemas de traducción

El primer intento siempre es el mismo: dos arrays, uno de claves y otro de cadenas
traducidas, con el mismo índice en ambos. Funciona hasta el día en que alguien inserta una
línea en medio de uno y no del otro. A partir de ahí todas las traducciones quedan
desplazadas una posición, y nada da error: el mundo simplemente muestra el texto
equivocado.

El problema es estructural: nada une una clave con sus traducciones salvo un número que
cualquier edición puede romper.

Una tabla en la que una fila contiene la clave **y** todos sus idiomas no puede
desincronizarse, porque no hay una segunda lista que mantener al día.

## El texto rara vez basta

Carteles, pósters, tablones de normas y botones de interfaz son a menudo imágenes con el
texto incrustado. Un sistema de traducción que solo cambia cadenas deja medio mundo en un
único idioma.

Lo que uses debe poder cambiar un **sprite o una textura** con el mismo mecanismo de
claves que una cadena.

## Recordar la elección

Volver a preguntar el idioma a un visitante que regresa, en cada visita, es el detalle que
hace que un mundo parezca sin terminar.

El SDK de VRChat ofrece `PlayerData` justo para esto desde la versión 3.10: el dato
persiste por jugador, entre sesiones, sin ninguno de los apaños de antes.

## ¿Y el propio editor?

Conviene separar dos cosas:

- **El texto del mundo**, que ven los visitantes — de eso trata esta página.
- **Las herramientas con las que construyes**, que veis tú y tu equipo en el Inspector de
  Unity.

FOS Essentials traduce ambas. Sus inspectores, descripciones emergentes y menús existen en
inglés, francés, español y alemán, elegidos por máquina desde el Hub.

## Hacerlo sin escribir Udon

[FOS Localization](/es/packs/localization/) te da un editor de tabla de verdad: una fila
por clave, una columna por idioma, tanto para textos como para imágenes. Importa y exporta
**CSV**, así que un traductor puede trabajar en una hoja de cálculo y devolverte el
archivo, y recuerda la elección del jugador entre visitas.

El pack es gratuito y solo requiere [FOS Essentials Core](/es/packs/core/).
