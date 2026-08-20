---
title: Installation
description: FOS Essentials Core und das erste Pack in einem VRChat-Weltprojekt installieren.
sidebar:
  order: 1
---

## Voraussetzungen

| Element | Version |
|---|---|
| Unity | 2022.3.22f1 |
| VRChat SDK — Worlds | 3.10.4 oder neuer |
| UdonSharp | im SDK enthalten |
| Render-Pipeline | Built-in, linearer Farbraum |

FOS Essentials richtet sich an Projekte, die mit dem
**VRChat Creator Companion** verwaltet werden.

## 1. Den Core installieren

Jedes Pack hängt von **FOS Essentials Core** ab. Importiere ihn zuerst und öffne
dann **FOS Essentials → Hub** in der Menüleiste von Unity.

Das Hub ist die Schaltzentrale der gesamten Reihe: Es listet die installierten
Packs, ihre Versionen und die jeweils benötigte Core-Version auf und meldet,
was fehlt.

## 2. Ein Pack importieren

Importiere das `.unitypackage` des gekauften oder heruntergeladenen Packs. Unity
kompiliert es, danach erscheint das Pack mit seiner Version im Hub.

Meldet das Hub einen zu alten Core, aktualisiere zuerst den Core. Ein Pack
umgeht eine fehlende Core-Funktion niemals stillschweigend.

## 3. Ein Prefab einsetzen

Jedes Pack liefert seine Prefabs in einem eigenen Untermenü:
**FOS Essentials → \<Pack\> → \<Prefab\>**.

Die Prefabs sind verdrahtet und einsatzbereit. Die Dokumentation des Packs nennt
die Felder, die du noch ausfüllen musst — meist ein Ziel-Transform, ein Canvas
oder eine Spielerliste.

## Die Sprache des Editors wählen

Das Hub hat eine Sprachauswahl: Englisch, Französisch, Spanisch und Deutsch. Sie
ändert die Inspektoren, die Tooltips und das Hub selbst. Die Wahl wird pro
Rechner gespeichert, nicht pro Projekt.
