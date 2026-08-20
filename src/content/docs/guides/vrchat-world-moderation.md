---
title: "Moderating a VRChat world"
description: "What a world creator can and cannot do about disruptive visitors in VRChat, and how in-world moderation tools with roles actually work."
sidebar:
  order: 4
---

**Short answer:** a world creator cannot ban anyone from VRChat, but can control what
happens inside their own world — who moves, who is heard, and who sees what.

## What is actually in your power

VRChat account bans belong to VRChat. What a world can do is act on the player *while
they are in it*:

| Action | What it means in a world |
|---|---|
| Freeze | Movement is taken away, the player stays where they are |
| Isolate | The player is moved to a separate area, away from everyone else |
| Mute | Their voice range is reduced to nothing for others in the world |
| Restore | Their normal movement and voice settings are given back |

None of this follows the player out of your world. It ends the moment they leave, which
is exactly the right scope for a world tool.

## Why roles matter more than buttons

The hard part is not freezing someone. It is deciding **who is allowed to**.

A moderation panel that anyone can open is worse than none at all. You need at least a
separation between the world owner, trusted staff and ordinary visitors — and, in most
communities, finer distinctions than that: someone who can mute but not teleport people,
a guide who can move visitors but not silence them.

## The trap of restoring settings

Freezing a player means overwriting their movement values. Unfreezing means writing
values back — and whatever you write back is what they get, not what they had.

This matters because avatars and worlds change movement settings for legitimate reasons.
Restoring hard-coded defaults can leave a player with a walk speed they never had. Decide
your world's normal values deliberately, and restore *those*.

## Late joiners see nothing

An important VRChat networking detail: a network event is not replayed for someone who
arrives afterwards. If moderation state lives only in events, a player who joins after a
freeze sees the frozen player walking normally.

Any tool you rely on has to rebuild its full state from synchronised variables when
someone joins — otherwise your moderators and your visitors see different worlds.

## Doing it without writing Udon

[FOS Tablet System](/packs/tablet-system/) is a tablet a player summons in front of them:
a teleport menu, local toggles, the world rules, and a full moderation panel with roles,
freeze, isolation, mute and a synchronised log. The restore values are fields you set,
not hidden defaults.

Its [Pro edition](/packs/tablet-system-pro/) replaces the four fixed roles with as many
as your world needs, each with its own permissions, plus per-account roles, per-role
visibility and per-role spawn points.

Both are paid packs. They require [FOS Essentials Core](/packs/core/),
[FOS Localization](/packs/localization/) and [FOS Teleport](/packs/teleport/), which are free.
