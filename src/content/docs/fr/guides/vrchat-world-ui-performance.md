---
title: "Les UI du monde et les draw calls dans VRChat"
description: "Pourquoi un canvas world-space coûte des images même quand personne ne le regarde, et comment le culling par distance garde rapide un monde VRChat chargé d'interfaces."
sidebar:
  order: 2
---

**Réponse courte :** un canvas world-space continue de coûter des draw calls et des
raycasts tant qu'il est activé, où que soit le joueur. Désactivez ceux qui sont hors de
portée.

## Un canvas que personne ne peut voir coûte quand même

Unity ne sait pas que votre panneau d'affichage est à l'autre bout de la carte. Tant que
son composant `Canvas` est activé, il est batché, soumis au rendu et — s'il porte un
`GraphicRaycaster` — testé contre les entrées du pointeur.

Dans un monde comptant vingt panneaux d'information, menus et pancartes, ce sont vingt
canvas qui paient leur loyer en permanence pour que les deux dont le joueur est
réellement proche soient lisibles.

## Désactiver le canvas, pas le GameObject

Cette distinction compte plus qu'il n'y paraît.

Un `SetActive(false)` sur l'objet parent relance tous les `OnEnable` de la hiérarchie au
retour — y compris ceux d'un comportement Udon attaché, qui peut réinitialiser un état
auquel vous teniez. Désactiver le seul composant `Canvas` arrête le rendu et ne touche à
rien d'autre.

Il en va de même pour le `GraphicRaycaster` : l'éteindre supprime le coût d'entrée sans
rien détruire.

## Quelle distance choisir ?

Celle à laquelle l'UI cesse d'être lisible. Pour un panneau mural avec du texte courant,
c'est souvent 8 à 15 mètres. Pour une grande pancarte, bien davantage.

Un piège : si vous masquez et affichez à la même distance exacte, un joueur posté sur la
limite fait clignoter l'UI à chaque image. Prévoyez une marge — masquer à 12 mètres, par
exemple, mais ne réafficher qu'à 10.

## Le faire sans écrire d'Udon

[FOS UI Culling](/fr/packs/ui-culling/) balaie votre scène, attache une cible à chaque
canvas world-space et les pilote tous depuis un unique manager.

- **Distance par défaut** pour tout le monde, surchargeable UI par UI.
- **Hystérésis**, la marge décrite plus haut, pour supprimer le clignotement de limite.
- **Vérifications par frame** — quatre par défaut — pour qu'un monde de cent UI étale ses
  tests au lieu de tous les faire d'un coup.
- Une passe optionnelle de **ligne de vue**, désactivée par défaut, pour les UI derrière
  un mur.

Le pack est gratuit et n'exige que [FOS Essentials Core](/fr/packs/core/).
