---
title: "Las UI del mundo y los draw calls en VRChat"
description: "Por qué un canvas world-space cuesta fotogramas aunque nadie lo mire, y cómo el culling por distancia mantiene rápido un mundo de VRChat lleno de interfaces."
sidebar:
  order: 2
---

**Respuesta corta:** un canvas world-space sigue costando draw calls y raycasts mientras
esté activado, esté donde esté el jugador. Desactiva los que quedan fuera de alcance.

## Un canvas que nadie puede ver cuesta igualmente

Unity no sabe que tu tablón de anuncios está al otro extremo del mapa. Mientras su
componente `Canvas` esté activado, se agrupa, se envía a renderizar y — si lleva un
`GraphicRaycaster` — se comprueba contra la entrada del puntero.

En un mundo con veinte paneles informativos, menús y carteles, son veinte canvas pagando
alquiler permanentemente para que los dos que el jugador tiene cerca puedan leerse.

## Desactiva el canvas, no el GameObject

Esta distinción importa más de lo que parece.

Un `SetActive(false)` sobre el objeto padre vuelve a ejecutar todos los `OnEnable` de la
jerarquía al reactivarlo — incluidos los de cualquier comportamiento de Udon adjunto, que
puede reiniciar un estado que te importaba. Desactivar solo el componente `Canvas` detiene
el renderizado y no toca nada más.

Lo mismo vale para el `GraphicRaycaster`: apagarlo elimina el coste de entrada sin
destruir nada.

## ¿Qué distancia debo usar?

Aquella a la que la UI deja de ser legible. Para un panel de pared con texto corrido, suele
estar entre 8 y 15 metros. Para un cartel grande, bastante más.

Una trampa: si ocultas y muestras exactamente a la misma distancia, un jugador situado en
el límite hace parpadear la UI en cada fotograma. Deja un margen — ocultar a 12 metros,
por ejemplo, pero volver a mostrar solo a 10.

## Hacerlo sin escribir Udon

[FOS UI Culling](/es/packs/ui-culling/) recorre tu escena, adjunta un objetivo a cada
canvas world-space y los dirige todos desde un único gestor.

- **Distancia por defecto** para todo el mundo, ajustable UI por UI.
- **Histéresis**, el margen descrito arriba, para eliminar el parpadeo en el límite.
- **Comprobaciones por fotograma** — cuatro por defecto — para que un mundo con cien UI
  reparta sus pruebas en vez de hacerlas todas de golpe.
- Una pasada opcional de **línea de visión**, desactivada por defecto, para las UI detrás
  de una pared.

El pack es gratuito y solo requiere [FOS Essentials Core](/es/packs/core/).
