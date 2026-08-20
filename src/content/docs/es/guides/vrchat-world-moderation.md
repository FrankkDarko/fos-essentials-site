---
title: "Moderar un mundo de VRChat"
description: "Qué puede y qué no puede hacer un creador de mundos ante un visitante problemático en VRChat, y cómo funcionan realmente las herramientas de moderación en el mundo con roles."
sidebar:
  order: 4
---

**Respuesta corta:** un creador de mundos no puede expulsar a nadie de VRChat, pero sí
decidir qué ocurre dentro de su propio mundo: quién se mueve, a quién se oye y quién ve
qué.

## Lo que realmente está en tu mano

Los baneos de cuenta son cosa de VRChat. Lo que un mundo puede hacer es actuar sobre el
jugador *mientras está dentro*:

| Acción | Qué significa dentro de un mundo |
|---|---|
| Inmovilizar | Se le retira el movimiento, el jugador se queda donde está |
| Aislar | Se le traslada a una zona aparte, lejos de los demás |
| Silenciar | Su alcance de voz se reduce a nada para los demás |
| Restaurar | Se le devuelven sus ajustes normales de movimiento y voz |

Nada de esto acompaña al jugador fuera de tu mundo. Termina en cuanto se va, que es
exactamente el alcance correcto para una herramienta de mundo.

## Por qué los roles importan más que los botones

Lo difícil no es inmovilizar a alguien. Es decidir **quién tiene derecho a hacerlo**.

Un panel de moderación que cualquiera puede abrir es peor que no tener ninguno. Hace falta
como mínimo separar al propietario del mundo, al personal de confianza y a los visitantes
corrientes — y, en la mayoría de comunidades, distinciones más finas todavía: alguien que
pueda silenciar pero no teletransportar, un guía que pueda mover visitantes pero no
callarlos.

## La trampa de restaurar los ajustes

Inmovilizar a un jugador significa sobrescribir sus valores de movimiento. Liberarlo
significa volver a escribir valores — y lo que escribas es lo que obtiene, no lo que
tenía.

Esto importa porque avatares y mundos cambian esos ajustes por razones legítimas.
Restaurar valores por defecto codificados a fuego puede dejar a un jugador con una
velocidad de caminar que nunca tuvo. Decide deliberadamente los valores normales de tu
mundo y restaura **esos**.

## Los que llegan tarde no ven nada

Un detalle importante de la red de VRChat: un evento de red no se reproduce para quien
llega después. Si el estado de moderación vive solo en eventos, un jugador que entra tras
una inmovilización ve al jugador inmovilizado caminando con normalidad.

Cualquier herramienta en la que confíes tiene que reconstruir su estado completo a partir
de variables sincronizadas cuando alguien entra — de lo contrario tus moderadores y tus
visitantes no ven el mismo mundo.

## Hacerlo sin escribir Udon

[FOS Tablet System](/es/packs/tablet-system/) es una tableta que el jugador hace aparecer
delante de él: menú de teletransporte, interruptores locales, normas del mundo y un panel
de moderación completo con roles, inmovilización, aislamiento, silencio y registro
sincronizado. Los valores restaurados son campos que tú defines, no valores por defecto
ocultos.

Su [edición Pro](/es/packs/tablet-system-pro/) sustituye los cuatro roles fijos por tantos
como necesite tu mundo, cada uno con sus permisos, además de roles por cuenta, visibilidad
por rol y puntos de aparición por rol.

Ambos son de pago. Requieren [FOS Essentials Core](/es/packs/core/),
[FOS Localization](/es/packs/localization/) y [FOS Teleport](/es/packs/teleport/), que son
gratuitos.
