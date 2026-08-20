---
title: "Les miroirs et le framerate dans les mondes VRChat"
description: "Pourquoi un miroir coûte si cher dans un monde VRChat, ce qu'il rend réellement, et comment en garder sans ruiner les performances sur PC comme sur Quest."
sidebar:
  order: 1
---

**Réponse courte :** un miroir fait rendre la scène une seconde fois, une fois par œil.
En laisser un allumé en permanence est la première raison pour laquelle un monde VRChat
tourne mal. Gardez vos miroirs, mais **éteints par défaut**, et laissez le joueur allumer
celui dont il a besoin.

## Pourquoi un miroir coûte-t-il si cher ?

Un miroir n'est pas une texture. C'est une seconde caméra qui rend votre scène depuis le
point de vue réfléchi — et en VR, une fois par œil. Un monde qui tourne à 90 images par
seconde sans miroir rend **trois fois par image** dès qu'un miroir est visible : œil
gauche, œil droit, et le reflet pour chacun.

Le coût dépend de ce que le miroir peut voir. Un miroir face à un mur vide est bon
marché. Un miroir face à votre salle principale, avec tous les avatars dedans, ne l'est
pas.

## Ce qui réduit vraiment le coût

Par ordre d'efficacité décroissante :

1. **Éteint par défaut.** Un miroir que personne n'a allumé ne coûte rien.
2. **Moins de layers.** Un miroir qui ne réfléchit que les avatars et les joueurs saute
   tout votre décor. C'est en général le plus gros gain après l'extinction.
3. **Résolution réduite.** La demi-résolution est souvent indiscernable en VR pour un
   miroir servant à vérifier un avatar.
4. **Des miroirs plus petits, qui voient moins.** La géométrie compte : ce que le miroir
   voit, il doit le rendre.

Aucun réglage ne rend un miroir gratuit. Quiconque prétend le contraire décrit en réalité
l'un des quatre points ci-dessus.

## Faut-il que les miroirs soient allumés à l'arrivée du joueur ?

Non. C'est le réglage par défaut le plus coûteux qui soit, et la plupart des visiteurs
n'utilisent jamais de miroir. Donnez-leur plutôt un interrupteur visible : un bouton sur
le cadre, ou une interaction sur le miroir lui-même.

L'exception, c'est un monde d'essayage d'avatars, où le miroir *est* le contenu.

## Est-ce différent sur Quest ?

Oui, considérablement. Un casque autonome dispose d'une fraction du budget GPU d'un PC,
et les miroirs sont le moyen le plus rapide de l'épuiser. Si votre monde sort sur les
deux plateformes, faites du Quest la contrainte qui décide des réglages par défaut :
éteint, basse résolution, layers minimaux.

## Le faire sans écrire d'Udon

[FOS Mirror](/fr/packs/mirror/) est fait exactement pour ça. Un manager balaie la scène,
trouve chaque miroir VRChat et en prend le contrôle. Les miroirs s'allument par distance,
par un bouton d'interface ou par interaction du joueur, et un **mode exclusif** garantit
qu'un seul est allumé à la fois.

Deux détails qui comptent en pratique :

- Il commute le **composant** `VRC_MirrorReflection`, jamais le GameObject. Désactiver
  l'objet relancerait tous les `OnEnable` de la hiérarchie, scripts Udon compris, et
  masquerait le cadre décoratif en même temps que le reflet.
- Le composant posé sur chaque miroir ne fait **aucun travail par frame**. Le manager
  possède l'unique boucle : ajouter des miroirs n'ajoute pas de coût de mise à jour.

Le pack est gratuit et n'exige que [FOS Essentials Core](/fr/packs/core/).
