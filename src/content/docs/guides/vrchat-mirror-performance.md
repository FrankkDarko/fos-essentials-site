---
title: "Mirrors and frame rate in VRChat worlds"
description: "Why mirrors cost so much in a VRChat world, what a mirror actually renders, and how to keep them without wrecking performance on PC and Quest."
sidebar:
  order: 1
---

**Short answer:** a mirror makes the scene render again, once per eye. Leaving one on
permanently is the single most common reason a VRChat world runs badly. Keep mirrors, but
keep them **off by default** and let players switch on the one they need.

## Why is a mirror so expensive?

A mirror is not a texture. It is a second camera rendering your scene from the reflected
point of view — and in VR, once per eye. A world that renders at 90 fps with no mirror is
rendering **three times per frame** with one mirror visible: left eye, right eye,
and the reflection for each.

The cost scales with what the mirror can see. A mirror facing an empty wall is cheap. A
mirror facing your entire main room, with every avatar in it, is not.

## What actually reduces the cost

In rough order of effect:

1. **Off by default.** A mirror nobody switched on costs nothing.
2. **Fewer layers.** A mirror that reflects only avatars and players skips your whole
   environment. This is usually the biggest single win after switching it off.
3. **Lower resolution.** Half resolution is often indistinguishable in VR for a mirror
   used to check an avatar.
4. **Smaller mirrors, facing less.** Geometry matters: what the mirror can see is what
   it has to render.

There is no setting that makes a mirror free. Anyone claiming otherwise is describing
one of the four points above.

## Should mirrors be on when a player arrives?

No. It is the most expensive possible default, and most visitors never use a mirror at
all. Give them a visible switch instead — a button on the frame, or an interaction on the
mirror itself.

The exception is an avatar-testing world, where the mirror *is* the content.

## Does this differ on Quest?

Yes, considerably. A standalone headset has a fraction of the GPU budget of a PC, and
mirrors are the fastest way to exhaust it. If your world ships to both platforms, treat
Quest as the constraint that decides the defaults: off, low resolution, minimal layers.

## Doing it without writing Udon

[FOS Mirror](/packs/mirror/) is built for exactly this. One manager scans the scene,
finds every VRChat mirror and takes control of it. Mirrors switch on by distance, by a UI
button, or by player interaction, and an **exclusive mode** guarantees that only one is
ever on at a time.

Two details that matter in practice:

- It switches the `VRC_MirrorReflection` **component**, never the GameObject. Disabling
  the object would re-run `OnEnable` on everything beneath it, Udon scripts included, and
  would hide the decorative frame along with the reflection.
- The per-mirror component does **no per-frame work**. The manager owns the single loop,
  so adding mirrors does not add update cost.

The pack is free and requires only [FOS Essentials Core](/packs/core/).
