---
title: Instalación
description: Instalar FOS Essentials Core y tu primer pack en un proyecto de mundo de VRChat.
sidebar:
  order: 1
---

## Requisitos

| Elemento | Versión |
|---|---|
| Unity | 2022.3.22f1 |
| VRChat SDK — Worlds | 3.10.4 o posterior |
| UdonSharp | incluido con el SDK |
| Pipeline de renderizado | Built-in, espacio de color lineal |

FOS Essentials está pensado para proyectos gestionados con el
**VRChat Creator Companion**.

## 1. Instalar el Core

Todos los packs dependen de **FOS Essentials Core**. Impórtalo primero y abre
**FOS Essentials → Hub** desde la barra de menús de Unity.

El Hub es el panel de control de toda la línea: enumera los packs instalados,
sus versiones, la versión del Core que cada uno necesita, e informa de lo que
falta.

## 2. Importar un pack

Importa el `.unitypackage` del pack que hayas comprado o descargado. Unity lo
compila y el pack aparece en el Hub con su versión.

Si el Hub indica que el Core es demasiado antiguo, actualízalo antes de usar el
pack. Un pack nunca sortea en silencio una función ausente del Core.

## 3. Colocar un prefab

Cada pack entrega sus prefabs en su propio submenú:
**FOS Essentials → \<Pack\> → \<Prefab\>**.

Los prefabs vienen conectados y listos. La documentación del pack indica los
campos que aún debes rellenar — normalmente un transform de destino, un canvas
o una lista de jugadores.

## Elegir el idioma del editor

El Hub tiene un selector de idioma: inglés, francés, español y alemán. Cambia
los inspectores, las descripciones emergentes y el propio Hub. La elección se
guarda por máquina, no por proyecto.
