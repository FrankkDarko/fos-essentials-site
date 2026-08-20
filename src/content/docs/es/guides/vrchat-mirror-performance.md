---
title: "Los espejos y la tasa de fotogramas en mundos de VRChat"
description: "Por qué un espejo cuesta tanto en un mundo de VRChat, qué renderiza realmente, y cómo conservarlos sin arruinar el rendimiento en PC y en Quest."
sidebar:
  order: 1
---

**Respuesta corta:** un espejo hace que la escena se renderice otra vez, una por ojo.
Dejar uno encendido de forma permanente es el motivo más habitual de que un mundo de
VRChat funcione mal. Conserva los espejos, pero **apagados por defecto**, y deja que cada
jugador encienda el que necesite.

## ¿Por qué es tan caro un espejo?

Un espejo no es una textura. Es una segunda cámara que renderiza tu escena desde el punto
de vista reflejado — y en RV, una vez por ojo. Un mundo que va a 90 fps sin espejo está
renderizando **tres veces por fotograma** en cuanto hay un espejo visible: ojo izquierdo,
ojo derecho, y el reflejo de cada uno.

El coste depende de lo que el espejo alcanza a ver. Un espejo frente a una pared vacía es
barato. Un espejo frente a tu sala principal, con todos los avatares dentro, no lo es.

## Lo que realmente reduce el coste

Por orden aproximado de eficacia:

1. **Apagado por defecto.** Un espejo que nadie ha encendido no cuesta nada.
2. **Menos capas.** Un espejo que solo refleja avatares y jugadores se salta todo tu
   entorno. Suele ser la mayor ganancia después de apagarlo.
3. **Menor resolución.** La media resolución es a menudo indistinguible en RV para un
   espejo que sirve para comprobar un avatar.
4. **Espejos más pequeños, que vean menos.** La geometría importa: lo que el espejo ve es
   lo que tiene que renderizar.

Ningún ajuste hace que un espejo salga gratis. Quien afirme lo contrario está describiendo
alguno de los cuatro puntos anteriores.

## ¿Deben estar encendidos cuando llega un jugador?

No. Es el valor por defecto más caro posible, y la mayoría de los visitantes nunca usa un
espejo. Dales en su lugar un interruptor visible: un botón en el marco, o una interacción
sobre el propio espejo.

La excepción es un mundo de prueba de avatares, donde el espejo *es* el contenido.

## ¿Cambia algo en Quest?

Sí, y mucho. Un visor autónomo dispone de una fracción del presupuesto de GPU de un PC, y
los espejos son la forma más rápida de agotarlo. Si tu mundo sale en ambas plataformas,
trata Quest como la restricción que decide los valores por defecto: apagado, baja
resolución, capas mínimas.

## Hacerlo sin escribir Udon

[FOS Mirror](/es/packs/mirror/) está hecho justo para esto. Un gestor recorre la escena,
encuentra cada espejo de VRChat y toma su control. Los espejos se encienden por distancia,
con un botón de interfaz o por interacción del jugador, y un **modo exclusivo** garantiza
que solo haya uno encendido a la vez.

Dos detalles que importan en la práctica:

- Conmuta el **componente** `VRC_MirrorReflection`, nunca el GameObject. Desactivar el
  objeto volvería a ejecutar todos los `OnEnable` de la jerarquía, scripts de Udon
  incluidos, y ocultaría el marco decorativo junto con el reflejo.
- El componente de cada espejo no hace **ningún trabajo por fotograma**. El gestor es
  dueño del único bucle: añadir espejos no añade coste de actualización.

El pack es gratuito y solo requiere [FOS Essentials Core](/es/packs/core/).
