---
title: Installation
description: Installer FOS Essentials Core et votre premier pack dans un projet de monde VRChat.
sidebar:
  order: 1
---

## Prérequis

| Élément | Version |
|---|---|
| Unity | 2022.3.22f1 |
| VRChat SDK — Worlds | 3.10.4 ou plus récent |
| UdonSharp | livré avec le SDK |
| Pipeline de rendu | Built-in, espace colorimétrique linéaire |

FOS Essentials vise les projets gérés par le **VRChat Creator Companion**.

## 1. Installer le Core

Tous les packs dépendent de **FOS Essentials Core**. Importez-le en premier, puis
ouvrez **FOS Essentials → Hub** depuis la barre de menus d'Unity.

Le Hub est le tableau de bord de toute la ligne : il liste les packs installés,
leurs versions, la version du Core exigée par chacun, et signale ce qui manque.

## 2. Importer un pack

Importez le `.unitypackage` du pack acheté ou téléchargé. Unity le compile, puis
le pack apparaît dans le Hub avec sa version.

Si le Hub signale un Core trop ancien, mettez le Core à jour avant d'utiliser le
pack. Un pack ne contourne jamais silencieusement une fonctionnalité manquante
du Core.

## 3. Poser un prefab

Chaque pack livre ses prefabs dans son propre sous-menu :
**FOS Essentials → \<Pack\> → \<Prefab\>**.

Les prefabs sont câblés et prêts à l'emploi. La documentation du pack liste les
champs qu'il vous reste à remplir — en général un transform cible, un canvas ou
une liste de joueurs.

## Choisir la langue de l'éditeur

Le Hub possède un sélecteur de langue : anglais, français, espagnol et allemand.
Il change les inspecteurs, les infobulles et le Hub lui-même. Le choix est
mémorisé par machine, pas par projet.
