---
title: "Les erreurs de synchro Udon qui ne lèvent jamais d'erreur"
description: "Les bugs réseau VRChat qui compilent proprement et paraissent corrects sur votre propre machine : arrivants tardifs, ownership, et événements qui agissent sur le mauvais joueur."
sidebar:
  order: 5
---

**Réponse courte :** la plupart des bugs de synchro VRChat sont invisibles quand vous
testez seul. Ils compilent, la console reste muette, et tout fonctionne — jusqu'à ce
qu'un deuxième joueur rejoigne, ou qu'un troisième arrive en retard.

Cette page liste ceux qui reviennent le plus souvent, ce qui se passe réellement, et
comment corriger chacun. [FOS Sync Doctor](/fr/packs/sync-doctor/) est un outil gratuit
qui les trouve dans votre projet et renvoie directement vers la section ci-dessous qui
explique votre cas.

---

## Des variables synchronisées jamais appliquées

**Le symptôme.** Tout fonctionne entre deux joueurs présents depuis le début. Un
troisième rejoint plus tard et voit le monde dans son état initial — portes fermées,
lumières éteintes, compteurs à zéro — pendant que tous les autres voient la réalité.

**Ce qui se passe.** VRChat envoie bien vos valeurs `[UdonSynced]` au nouvel arrivant.
Rien, sur sa machine, ne les lit. Les valeurs restent dans les variables pendant que la
scène continue d'afficher ce qu'elle affichait au chargement.

**La correction.** Surchargez `OnDeserialization()` et appliquez-y l'état :

```csharp
public override void OnDeserialization()
{
    door.SetActive(_isOpen);
}
```

La même méthode doit s'exécuter quand vous changez la valeur vous-même, pour que le
propriétaire et les distants aboutissent au même endroit. Un unique `Apply()` appelé des
deux côtés est la forme habituelle.

`[FieldChangeCallback]` est l'autre bonne réponse : le setter de la propriété se déclenche
à la désérialisation, si bien que l'état est appliqué sans `OnDeserialization` du tout.

---

## RequestSerialization dans Start()

**Le symptôme.** L'état initial atteint les joueurs déjà présents, et n'atteint jamais
ceux qui rejoignent ensuite.

**Ce qui se passe.** VRChat documente qu'une sérialisation demandée depuis `Start()`
n'atteint pas les arrivants tardifs. L'appel intervient trop tôt dans la vie réseau de
l'objet pour être conservé.

**La correction.** Posez vos valeurs initiales dans `Start()` si vous le souhaitez, mais
sérialisez ailleurs — sur une interaction, ou dans `OnPlayerJoined`. Le propriétaire est
le seul qui doive envoyer quoi que ce soit :

```csharp
public override void OnPlayerJoined(VRCPlayerApi player)
{
    if (Networking.IsOwner(gameObject)) RequestSerialization();
}
```

---

## Une synchro manuelle qui ne sérialise jamais

**Le symptôme.** Vos variables changent sur votre écran et nulle part ailleurs.

**Ce qui se passe.** `BehaviourSyncMode.Manual` n'envoie rien de lui-même. Il attend
`RequestSerialization()`. Sans cet appel, les variables sont en pratique des variables
locales portant un attribut décoratif.

**La correction.** Appelez-le après chaque changement qui compte. Si un autre script
sérialise celui-ci pour vous, c'est très bien aussi — mais vérifiez qu'il le fait
réellement.

---

## Sérialiser sans être propriétaire

**Le symptôme.** Ça fonctionne pour celui qui a posé l'objet, et pour personne d'autre.
Pas d'erreur, pas d'avertissement, rien dans le journal.

**Ce qui se passe.** Seul le propriétaire d'un objet peut le sérialiser. Appelé par
quelqu'un d'autre, `RequestSerialization()` ne fait silencieusement rien.

**La correction.** Prenez l'ownership avant d'écrire, puis sérialisez :

```csharp
if (!Networking.IsOwner(Networking.LocalPlayer, gameObject))
{
    Networking.SetOwner(Networking.LocalPlayer, gameObject);
}

_isOpen = !_isOpen;
RequestSerialization();
```

---

## La synchro continue et le plafond de 200 octets

**Le symptôme.** Les petites valeurs se synchronisent bien. Ajoutez une chaîne ou un
tableau et les mises à jour deviennent erratiques, ou cessent.

**Ce qui se passe.** La synchro continue est plafonnée à environ 200 octets par
behaviour. Un champ de longueur variable franchit cette limite sans vous prévenir.

**La correction.** Passez en `BehaviourSyncMode.Manual`, qui transporte bien davantage, et
sérialisez quand la valeur change réellement plutôt qu'en continu. Le mode continu est
fait pour ce qui change à chaque image et tolère la perte — une plateforme mobile, pas un
journal de discussion.

---

## Aucun mode de synchro déclaré

**Le symptôme.** Rien, jusqu'au jour où quelqu'un change le mode dans l'inspecteur et où
un monde qui fonctionnait cesse de fonctionner.

**Ce qui se passe.** Sans `[UdonBehaviourSyncMode]`, le mode vaut *Any* par défaut, et
reste modifiable instance par instance.

**La correction.** Déclarez-le sur la classe. Cela documente l'intention et supprime un
réglage auquel personne ne devrait toucher :

```csharp
[UdonBehaviourSyncMode(BehaviourSyncMode.Manual)]
public class MyDoor : UdonSharpBehaviour
```

---

## Les événements joueur se déclenchent pour tout le monde

**Le symptôme.** Quelqu'un d'autre traverse votre trigger et l'effet se produit sur votre
écran.

**Ce qui se passe.** `OnPlayerTriggerEnter` et ses semblables s'exécutent sur **tous** les
clients, pour **chaque** joueur entrant dans le volume. Votre machine exécute le
gestionnaire quand un inconnu entre, et `player` est cet inconnu.

**La correction.** Filtrez dès la première ligne, avant toute autre chose :

```csharp
public override void OnPlayerTriggerEnter(VRCPlayerApi player)
{
    if (!Utilities.IsValid(player) || !player.isLocal) return;

    // ...
}
```

Agir sur tous les joueurs est un choix légitime — compter qui se trouve dans une zone, par
exemple. Mais cela doit être une décision, pas un oubli.

---

## Les événements dont le nom commence par un souligné

**Le symptôme.** Un événement réseau qui ne fait absolument rien. Pas d'erreur, pas une
ligne de journal.

**Ce qui se passe.** VRChat refuse d'exécuter à distance tout événement dont le nom
commence par un souligné. Ces noms sont réservés à ses propres rappels. Votre appel part
et se fait jeter à l'arrivée.

**La correction.** Renommez la méthode. Et servez-vous de la règle à l'envers : préfixer
une méthode publique d'un souligné est un moyen économique de garantir qu'elle ne pourra
**jamais** être déclenchée à distance par un client modifié.

---

## Un événement diffusé qui agit sur le joueur local

**Le symptôme.** Celui qui coûte le plus de temps à comprendre. Une personne appuie sur un
bouton de téléportation et toute l'instance est déplacée.

**Ce qui se passe.** Un événement envoyé avec `NetworkEventTarget.All` s'exécute sur tous
les clients. À l'intérieur, `Networking.LocalPlayer` désigne un joueur différent sur
chaque machine. Une ligne censée *vous* déplacer déplace donc celui qui l'exécute —
c'est-à-dire tout le monde.

```csharp
// Tout le monde est teleporte.
public override void Interact()
{
    SendCustomNetworkEvent(NetworkEventTarget.All, nameof(DoTeleport));
}

public void DoTeleport()
{
    Networking.LocalPlayer.TeleportTo(target.position, target.rotation);
}
```

**La correction.** Demandez-vous à qui appartient l'action.

Une téléportation appartient à une seule personne : ne la diffusez pas du tout. Appelez la
méthode directement — elle s'exécute déjà sur la machine du joueur qui a appuyé, et VRChat
synchronise sa position pour vous.

```csharp
public override void Interact()
{
    Networking.LocalPlayer.TeleportTo(target.position, target.rotation);
}
```

Les événements diffusés sont faits pour ce qui appartient au monde — ouvrir une porte,
jouer un effet, lancer un décompte. Si le corps d'un gestionnaire diffusé mentionne
`LocalPlayer`, c'est presque toujours le mauvais outil.

---

## Tester pour les arrivants tardifs

Rien de tout cela n'apparaît quand on est seul. L'habitude la moins coûteuse, et qui en
attrape le plus : **deux joueurs changent l'état, un troisième rejoint ensuite, et vous
vérifiez que le troisième voit ce que les deux autres voient.** Faites-le une fois par
fonctionnalité et la majorité de ces bugs remontent avant que vos joueurs ne les trouvent.

[FOS Sync Doctor](/fr/packs/sync-doctor/) automatise la part qu'une liste de contrôle ne
peut pas couvrir : il lit chaque comportement synchronisé de votre projet et signale les
cas ci-dessus, en distinguant ce qui est certain de ce qui n'est que probable.
