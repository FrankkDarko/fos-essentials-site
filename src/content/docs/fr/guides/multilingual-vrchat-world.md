---
title: "Rendre un monde VRChat multilingue"
description: "Comment traduire les textes et les images d'un monde VRChat, pourquoi les tableaux parallèles finissent par casser, et comment mémoriser la langue d'un visiteur d'une visite à l'autre."
sidebar:
  order: 3
---

**Réponse courte :** gardez toutes les langues d'une même chaîne sur une seule ligne,
plutôt que dans des tableaux séparés, et mémorisez le choix du joueur pour qu'il n'ait
jamais à le refaire.

## Pourquoi la plupart des systèmes de traduction pourrissent

La première tentative est toujours la même : deux tableaux, l'un de clés, l'autre de
chaînes traduites, et le même indice dans les deux. Ça marche jusqu'au jour où quelqu'un
insère une ligne au milieu de l'un et pas de l'autre. À partir de là, toutes les
traductions sont décalées d'un cran, et rien ne lève d'erreur : le monde affiche
simplement le mauvais texte.

Le problème est structurel : rien ne relie une clé à ses traductions, sinon un numéro que
la moindre modification peut casser.

Une table où une ligne porte la clé **et** toutes ses langues ne peut pas se
désynchroniser, puisqu'il n'y a pas de seconde liste à maintenir en phase.

## Le texte suffit rarement

Pancartes, affiches, panneaux de règlement et boutons d'interface sont souvent des images
avec le texte incrusté. Un système de traduction qui ne remplace que des chaînes laisse
la moitié de votre monde dans une seule langue.

Ce que vous utilisez doit pouvoir remplacer un **sprite ou une texture** par le même
mécanisme de clé qu'une chaîne.

## Mémoriser le choix

Redemander sa langue à un visiteur qui revient, à chaque visite, est le détail qui donne
à un monde son air d'inachevé.

Le SDK VRChat propose `PlayerData` précisément pour ça depuis la version 3.10 : la donnée
persiste par joueur, d'une session à l'autre, sans aucun des bricolages d'autrefois.

## Et l'éditeur lui-même ?

Il vaut la peine de distinguer deux choses :

- **Le texte du monde**, vu par les visiteurs — c'est le sujet de cette page.
- **Les outils avec lesquels vous construisez**, vus par vous et votre équipe dans
  l'inspecteur Unity.

FOS Essentials traduit les deux. Ses inspecteurs, infobulles et menus existent en
anglais, français, espagnol et allemand, au choix par machine depuis le Hub.

## Le faire sans écrire d'Udon

[FOS Localization](/fr/packs/localization/) vous donne un véritable éditeur de table :
une ligne par clé, une colonne par langue, pour les textes comme pour les images. Il
importe et exporte du **CSV**, si bien qu'un traducteur peut travailler dans un tableur
et vous rendre le fichier, et il mémorise le choix du joueur d'une visite à l'autre.

Le pack est gratuit et n'exige que [FOS Essentials Core](/fr/packs/core/).
