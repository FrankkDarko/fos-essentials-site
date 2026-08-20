---
title: Installation
description: "Install FOS Essentials in a VRChat world project through the Creator Companion: add the listing once, then install each tool separately."
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

## 1. Add the listing, once

In the Creator Companion, open **Settings → Packages → Add Repository** and paste:

```
https://essentials.frenchoasis.studio/index.json
```

The [download page](/download/) has a button that does this for you if the Creator
Companion is installed.

You only ever do this once. Every free pack, and every future version, appears from
there on.

## 2. Install the tools you want

Open your project in the Creator Companion, go to **Manage Project**, and install any
FOS pack from the list.

**The Core installs itself.** Every pack declares FOS Essentials Core as a dependency,
in the exact version it needs, so the Creator Companion pulls it in. There is no order
to respect and no way to end up with a tool whose Core is missing or too old.

Updates appear in the same place, like any other package.

## 3. If you already installed a pack by hand

Nothing to clean up. Each package names the folder its manual version used, so the
Creator Companion removes `Assets/FOS/<Pack>` while installing. Asset identifiers are
preserved, which means a scene you already wired keeps working.

Back up your project first, as you would before any package change.

## 4. Paid packs are installed manually

A VPM listing is public, and so is everything it points to. **Tablet System Standard**
and **Pro** are therefore delivered as `.unitypackage` files through the store.

Import them the usual way: **Assets → Import Package → Custom Package**. They depend on
free packs — install those from the Creator Companion first, and the Hub will tell you if
anything is missing.

## 5. Open the Hub

**FOS Essentials → Hub**, from the Unity menu bar.

The Hub is the control panel of the whole line: it lists the installed packs, their
versions, the Core version each one needs, and reports anything missing.

## 6. Drop in a prefab

Each pack ships its prefabs under its own submenu:
**FOS Essentials → \<Pack\> → \<Prefab\>**.

Prefabs are wired and ready. The pack documentation lists the fields you still have to
fill in — usually a target transform, a canvas or a list of players.

## Choosing the editor language

The Hub has a language selector: English, French, Spanish and German. It changes the
inspectors, the tooltips and the Hub itself. The choice is stored per machine, not per
project.
