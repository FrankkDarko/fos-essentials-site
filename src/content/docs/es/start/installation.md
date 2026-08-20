---
title: Instalación
description: "Instalar FOS Essentials en un proyecto de mundo de VRChat desde el Creator Companion: añade el listado una vez e instala cada herramienta por separado."
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

## 1. Añadir el listado, una sola vez

En el Creator Companion, abre **Settings → Packages → Add Repository** y pega:

```
https://essentials.frenchoasis.studio/index.json
```

La [página de descargas](/es/download/) tiene un botón que lo hace por ti si el Creator
Companion está instalado.

Esto se hace una única vez. A partir de ahí aparecen todos los packs gratuitos y todas
sus versiones futuras.

## 2. Instalar las herramientas que quieras

Abre tu proyecto en el Creator Companion, ve a **Manage Project** e instala cualquier
pack de FOS desde la lista.

**El Core se instala solo.** Cada pack declara FOS Essentials Core como dependencia, en la
versión exacta que necesita, y el Creator Companion lo trae consigo. No hay ningún orden
que respetar ni forma de acabar con una herramienta cuyo Core falte o sea demasiado
antiguo.

Las actualizaciones aparecen en el mismo sitio, como en cualquier otro paquete.

## 3. Si ya instalaste un pack a mano

No hay nada que limpiar. Cada paquete indica la carpeta que ocupaba su versión manual, y
el Creator Companion elimina `Assets/FOS/<Pack>` durante la instalación. Los
identificadores de assets se conservan, así que una escena ya conectada sigue
funcionando.

Aun así, haz una copia de seguridad del proyecto antes, como ante cualquier cambio de
paquetes.

## 4. Los packs de pago se instalan manualmente

Un listado VPM es público, y también lo es todo aquello a lo que apunta. **Tablet System
Standard** y **Pro** se entregan por tanto como archivos `.unitypackage` desde la tienda.

Impórtalos como siempre: **Assets → Import Package → Custom Package**. Dependen de packs
gratuitos: instala esos primero desde el Creator Companion y el Hub te dirá si falta
algo.

## 5. Abrir el Hub

**FOS Essentials → Hub**, desde la barra de menús de Unity.

El Hub es el panel de control de toda la línea: enumera los packs instalados, sus
versiones, la versión del Core que necesita cada uno, e informa de lo que falta.

## 6. Colocar un prefab

Cada pack entrega sus prefabs en su propio submenú:
**FOS Essentials → \<Pack\> → \<Prefab\>**.

Los prefabs vienen conectados y listos. La documentación del pack indica los campos que
aún debes rellenar: normalmente un transform de destino, un canvas o una lista de
jugadores.

## Elegir el idioma del editor

El Hub tiene un selector de idioma: inglés, francés, español y alemán. Cambia los
inspectores, las descripciones emergentes y el propio Hub. La elección se guarda por
máquina, no por proyecto.
