---
title: "Making a VRChat world multilingual"
description: "How to translate the text and images of a VRChat world, why parallel arrays break, and how to remember a visitor's language between visits."
sidebar:
  order: 3
---

**Short answer:** keep every language of a given string together in one row, not in
separate arrays, and store the player's choice so they never have to pick twice.

## Why most translation setups rot

The usual first attempt is two arrays: one of keys, one of translated strings, and the
same index in both. It works until someone inserts a line in the middle of one array and
not the other. From that point every translation is shifted by one, and nothing errors —
the world simply displays the wrong text.

The problem is structural: nothing ties a key to its translations except a number that
any edit can break.

A table where one row holds the key **and** all its languages cannot desynchronise,
because there is no second list to keep in step.

## Text is rarely enough

Signs, posters, rule boards and UI buttons are often images with text baked in. A
translation system that only swaps strings leaves half your world in one language.

Whatever you use should be able to swap a **sprite or texture** on the same key
mechanism as a string.

## Remembering the choice

Asking a returning visitor to pick their language again, every single visit, is the
detail that makes a world feel unfinished.

The VRChat SDK offers `PlayerData` for exactly this since version 3.10 — it persists per
player, across sessions, without any of the older workarounds.

## What about the editor itself?

Worth separating two things:

- **The world's text**, seen by visitors — that is what this page is about.
- **The tools you build with**, seen by you and your team in the Unity Inspector.

FOS Essentials translates both. Its inspectors, tooltips and menus exist in English,
French, Spanish and German, chosen per machine in the Hub.

## Doing it without writing Udon

[FOS Localization](/packs/localization/) gives you a real table editor: one row per key,
one column per language, for text and images alike. It imports and exports **CSV**, so a
translator can work in a spreadsheet and hand the file back, and it remembers the
player's choice between visits.

The pack is free and requires only [FOS Essentials Core](/packs/core/).
