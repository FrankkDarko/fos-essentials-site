---
title: Installation
description: Install FOS Essentials Core and your first pack in a VRChat world project.
sidebar:
  order: 1
---

## Requirements

| Item | Version |
|---|---|
| Unity | 2022.3.22f1 |
| VRChat SDK — Worlds | 3.10.4 or later |
| UdonSharp | bundled with the SDK |
| Render pipeline | Built-in, Linear color space |

FOS Essentials targets projects managed by the **VRChat Creator Companion**.

## 1. Install the Core

Every pack depends on **FOS Essentials Core**. Import it first, then open
**FOS Essentials → Hub** from the Unity menu bar.

The Hub is the control panel of the whole line: it lists the installed packs,
their versions, the Core version each one needs, and it reports anything
missing.

## 2. Import a pack

Import the `.unitypackage` of the pack you bought or downloaded. Unity compiles
it, then the pack appears in the Hub with its version.

If the Hub reports a Core that is too old, update the Core before using the
pack. A pack never silently works around a missing Core feature.

## 3. Drop in a prefab

Each pack ships its prefabs under its own submenu:
**FOS Essentials → \<Pack\> → \<Prefab\>**.

Prefabs are wired and ready. The pack documentation lists the fields you still
have to fill in — usually a target transform, a canvas or a list of players.

## Choosing the editor language

The Hub has a language selector: English, French, Spanish and German. It
changes the inspectors, the tooltips and the Hub itself. The choice is stored
per machine, not per project.
