---
title: "Udon sync mistakes that never raise an error"
description: "The VRChat networking bugs that compile cleanly and look right on your own machine: late joiners, ownership, and events that act on the wrong player."
sidebar:
  order: 5
---

**Short answer:** most VRChat sync bugs are invisible while you test alone. They compile,
the console stays quiet, and everything works — until a second player joins, or a third
one arrives late.

This page lists the ones that come back the most often, what actually happens, and how to
fix each. [FOS Sync Doctor](/packs/sync-doctor/) is a free tool that finds them in your
project and links straight back to the section below that explains your case.

---

## Synced variables that are never applied

**The symptom.** Everything works between two players who were there from the start. A
third joins later and sees the world in its opening state — doors closed, lights off,
counters at zero — while everybody else sees the real thing.

**What happens.** VRChat sends your `[UdonSynced]` values to the newcomer. Nothing on
their machine reads them. The values sit in the variables while the scene keeps showing
whatever it showed at load.

**The fix.** Override `OnDeserialization()` and apply the state there:

```csharp
public override void OnDeserialization()
{
    door.SetActive(_isOpen);
}
```

The same method must run when you change the value yourself, so the owner and the remotes
end up in the same place. A single `Apply()` called from both is the usual shape.

`[FieldChangeCallback]` is the other correct answer: the property setter fires on
deserialisation, so the state is applied without `OnDeserialization` at all.

---

## RequestSerialization inside Start()

**The symptom.** The initial state reaches the players already present, and never reaches
anyone who joins afterwards.

**What happens.** VRChat documents that a serialisation requested from `Start()` does not
reach late joiners. The call is made too early in the object's network life to be kept.

**The fix.** Set your initial values in `Start()` if you like, but serialise from
somewhere else — an interaction, or `OnPlayerJoined`. The owner is the only one who should
send anything:

```csharp
public override void OnPlayerJoined(VRCPlayerApi player)
{
    if (Networking.IsOwner(gameObject)) RequestSerialization();
}
```

---

## Manual sync that never serialises

**The symptom.** Your variables change on your screen and nowhere else.

**What happens.** `BehaviourSyncMode.Manual` sends nothing on its own. It waits for
`RequestSerialization()`. Without that call the variables are, in practice, local ones
with a decorative attribute.

**The fix.** Call it after every change that matters. If another script serialises this
one for you, that is fine too — but check that it really does.

---

## Serialising without owning

**The symptom.** It works for the person who placed the object, and for nobody else. No
error, no warning, nothing in the log.

**What happens.** Only the owner of an object can serialise it. Called by anyone else,
`RequestSerialization()` silently does nothing.

**The fix.** Take ownership before writing, then serialise:

```csharp
if (!Networking.IsOwner(Networking.LocalPlayer, gameObject))
{
    Networking.SetOwner(Networking.LocalPlayer, gameObject);
}

_isOpen = !_isOpen;
RequestSerialization();
```

---

## Continuous sync and the 200-byte cap

**The symptom.** Small values sync fine. Add a string or an array and updates become
erratic, or stop.

**What happens.** Continuous sync is capped at roughly 200 bytes per behaviour. A
variable-length field crosses that line without telling you.

**The fix.** Move to `BehaviourSyncMode.Manual`, which carries far more, and serialise
when the value actually changes rather than continuously. Continuous is for things that
change every frame and tolerate loss — a moving platform, not a chat log.

---

## No sync mode declared

**The symptom.** Nothing, until somebody changes the mode in the inspector and a world
that worked stops working.

**What happens.** Without `[UdonBehaviourSyncMode]` the mode defaults to *Any*, and stays
editable per instance.

**The fix.** Declare it on the class. It documents the intent and removes a setting nobody
should be touching:

```csharp
[UdonBehaviourSyncMode(BehaviourSyncMode.Manual)]
public class MyDoor : UdonSharpBehaviour
```

---

## Player events fire for everyone

**The symptom.** Somebody else walks through your trigger and the effect happens on your
screen.

**What happens.** `OnPlayerTriggerEnter` and its siblings run on **every** client, for
**every** player entering the volume. Your machine runs the handler when a stranger walks
in, and `player` is that stranger.

**The fix.** Filter on the first line, before anything else:

```csharp
public override void OnPlayerTriggerEnter(VRCPlayerApi player)
{
    if (!Utilities.IsValid(player) || !player.isLocal) return;

    // ...
}
```

Acting on all players is a legitimate choice — counting who is inside a zone, for
instance. But it should be a decision, not an oversight.

---

## Events whose name starts with an underscore

**The symptom.** A network event that does absolutely nothing. No error, no log line.

**What happens.** VRChat refuses to run remotely any event whose name begins with an
underscore. The names are reserved for its own callbacks. Your call leaves and is dropped
on arrival.

**The fix.** Rename the method. And use the rule the other way round: prefixing a public
method with `_` is a cheap way to make sure it can **never** be triggered remotely by a
modified client.

---

## A broadcast event acting on the local player

**The symptom.** The one that costs the most time to understand. One person presses a
teleport button and the entire instance is moved.

**What happens.** An event sent with `NetworkEventTarget.All` runs on every client. Inside
it, `Networking.LocalPlayer` is a different player on each machine. So a line meant to
move *you* moves whoever is running it — which is everyone.

```csharp
// Everyone is teleported.
public override void Interact()
{
    SendCustomNetworkEvent(NetworkEventTarget.All, nameof(DoTeleport));
}

public void DoTeleport()
{
    Networking.LocalPlayer.TeleportTo(target.position, target.rotation);
}
```

**The fix.** Ask yourself who the action belongs to.

A teleport belongs to one person: do not broadcast it at all. Call the method directly —
it already runs on the machine of the player who pressed the button, and VRChat
synchronises their position for you.

```csharp
public override void Interact()
{
    Networking.LocalPlayer.TeleportTo(target.position, target.rotation);
}
```

Broadcast events are for things that belong to the world — opening a door, playing an
effect, starting a countdown. If the body of a broadcast handler mentions
`LocalPlayer`, it is almost always the wrong tool.

---

## Testing for late joiners

None of this shows up alone. The cheapest habit that catches most of it: **two players
change the state, a third joins afterwards, and you check that the third sees what the
other two see.** Run that once per feature and the majority of these bugs surface before
your players find them.

[FOS Sync Doctor](/packs/sync-doctor/) automates the part a checklist cannot cover — it
reads every synchronised behaviour in your project and reports the cases above, telling
you which findings are certain and which are only probable.
