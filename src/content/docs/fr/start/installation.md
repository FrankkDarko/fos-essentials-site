---
title: Installation
description: "Installer FOS Essentials dans un projet de monde VRChat depuis le Creator Companion : ajoutez le listing une fois, puis installez chaque outil séparément."
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

## 1. Ajouter le listing, une seule fois

Dans le Creator Companion, ouvrez **Settings → Packages → Add Repository** et collez :

```
https://essentials.frenchoasis.studio/index.json
```

La [page de téléchargement](/fr/download/) propose un bouton qui le fait pour vous si le
Creator Companion est installé.

Ce geste ne se fait qu'une fois. Tous les packs gratuits, et toutes leurs versions à
venir, apparaîtront ensuite d'eux-mêmes.

## 2. Installer les outils voulus

Ouvrez votre projet dans le Creator Companion, allez dans **Manage Project**, et
installez n'importe quel pack FOS depuis la liste.

**Le Core s'installe tout seul.** Chaque pack déclare FOS Essentials Core comme
dépendance, dans la version exacte qu'il exige, et le Creator Companion le tire avec lui.
Aucun ordre à respecter, et aucun moyen de se retrouver avec un outil dont le Core manque
ou est trop ancien.

Les mises à jour apparaissent au même endroit, comme pour n'importe quel autre paquet.

## 3. Si vous avez déjà installé un pack à la main

Rien à nettoyer. Chaque paquet nomme le dossier qu'occupait sa version manuelle, et le
Creator Companion supprime `Assets/FOS/<Pack>` pendant l'installation. Les identifiants
d'assets sont conservés : une scène déjà câblée continue de fonctionner.

Sauvegardez tout de même votre projet au préalable, comme avant toute modification de
paquets.

## 4. Les packs payants s'installent manuellement

Un listing VPM est public, et tout ce vers quoi il pointe l'est aussi. **Tablet System
Standard** et **Pro** sont donc livrés en `.unitypackage` par la boutique.

Importez-les comme d'habitude : **Assets → Import Package → Custom Package**. Ils
dépendent de packs gratuits — installez ceux-là d'abord depuis le Creator Companion, et
le Hub vous signalera ce qui manque.

## 5. Ouvrir le Hub

**FOS Essentials → Hub**, depuis la barre de menus d'Unity.

Le Hub est le tableau de bord de toute la ligne : il liste les packs installés, leurs
versions, la version du Core exigée par chacun, et signale ce qui manque.

## 6. Poser un prefab

Chaque pack livre ses prefabs dans son propre sous-menu :
**FOS Essentials → \<Pack\> → \<Prefab\>**.

Les prefabs sont câblés et prêts à l'emploi. La documentation du pack liste les champs
qu'il vous reste à remplir — en général un transform cible, un canvas ou une liste de
joueurs.

## Choisir la langue de l'éditeur

Le Hub possède un sélecteur de langue : anglais, français, espagnol et allemand. Il change
les inspecteurs, les infobulles et le Hub lui-même. Le choix est mémorisé par machine, pas
par projet.
