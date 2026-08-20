---
title: "Modérer un monde VRChat"
description: "Ce qu'un créateur de monde peut et ne peut pas faire contre un visiteur perturbateur dans VRChat, et comment fonctionnent réellement les outils de modération en jeu avec des rôles."
sidebar:
  order: 4
---

**Réponse courte :** un créateur de monde ne peut bannir personne de VRChat, mais il peut
décider de ce qui se passe dans son propre monde — qui se déplace, qui se fait entendre,
et qui voit quoi.

## Ce qui est réellement en votre pouvoir

Les bannissements de compte appartiennent à VRChat. Ce qu'un monde peut faire, c'est agir
sur le joueur *pendant qu'il s'y trouve* :

| Action | Ce que ça signifie dans un monde |
|---|---|
| Immobiliser | Le déplacement lui est retiré, le joueur reste sur place |
| Isoler | Le joueur est déplacé dans une zone à part, loin des autres |
| Couper le micro | Sa portée vocale est réduite à néant pour les autres |
| Restaurer | Ses réglages normaux de déplacement et de voix lui sont rendus |

Rien de tout cela ne suit le joueur hors de votre monde. Tout cesse à l'instant où il le
quitte, ce qui est exactement la bonne portée pour un outil de monde.

## Pourquoi les rôles comptent plus que les boutons

Le difficile n'est pas d'immobiliser quelqu'un. C'est de décider **qui en a le droit**.

Un panneau de modération que n'importe qui peut ouvrir est pire que pas de panneau du
tout. Il faut au minimum séparer le propriétaire du monde, le staff de confiance et les
visiteurs ordinaires — et, dans la plupart des communautés, des distinctions plus fines
encore : quelqu'un qui peut couper un micro mais pas téléporter, un guide qui peut
déplacer les visiteurs mais pas les faire taire.

## Le piège de la restauration des réglages

Immobiliser un joueur, c'est écraser ses valeurs de déplacement. Le libérer, c'est
réécrire des valeurs — et ce que vous réécrivez est ce qu'il obtient, pas ce qu'il avait.

Cela compte, parce qu'avatars et mondes modifient ces réglages pour de bonnes raisons.
Restaurer des valeurs par défaut codées en dur peut laisser un joueur avec une vitesse de
marche qu'il n'a jamais eue. Décidez délibérément des valeurs normales de votre monde, et
restaurez **celles-là**.

## Les arrivants tardifs ne voient rien

Un détail important du réseau VRChat : un événement réseau n'est pas rejoué pour celui
qui arrive après. Si l'état de modération ne vit que dans des événements, un joueur qui
rejoint après une immobilisation voit le joueur immobilisé marcher normalement.

Tout outil sur lequel vous comptez doit reconstruire son état complet depuis des
variables synchronisées à l'arrivée d'un joueur — sans quoi vos modérateurs et vos
visiteurs ne voient pas le même monde.

## Le faire sans écrire d'Udon

[FOS Tablet System](/fr/packs/tablet-system/) est une tablette que le joueur fait
apparaître devant lui : menu de téléportation, interrupteurs locaux, règlement du monde,
et un panneau de modération complet avec rôles, immobilisation, isolement, coupure micro
et journal synchronisé. Les valeurs restaurées sont des champs que vous réglez, pas des
valeurs par défaut cachées.

Son [édition Pro](/fr/packs/tablet-system-pro/) remplace les quatre rôles figés par
autant que votre monde en demande, chacun avec ses propres permissions, plus les rôles
par compte, la visibilité par rôle et les points d'apparition par rôle.

Les deux sont payants. Ils exigent [FOS Essentials Core](/fr/packs/core/),
[FOS Localization](/fr/packs/localization/) et [FOS Teleport](/fr/packs/teleport/), qui
sont gratuits.
