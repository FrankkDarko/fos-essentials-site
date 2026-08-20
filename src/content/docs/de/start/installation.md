---
title: Installation
description: "FOS Essentials über den Creator Companion in ein VRChat-Weltprojekt installieren: Listing einmal hinzufügen, dann jedes Werkzeug einzeln installieren."
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

FOS Essentials richtet sich an Projekte, die mit dem **VRChat Creator Companion**
verwaltet werden.

## 1. Das Listing einmalig hinzufügen

Öffne im Creator Companion **Settings → Packages → Add Repository** und füge ein:

```
https://essentials.frenchoasis.studio/index.json
```

Die [Download-Seite](/de/download/) hat eine Schaltfläche, die das für dich übernimmt,
sofern der Creator Companion installiert ist.

Das machst du nur ein einziges Mal. Danach erscheinen alle kostenlosen Packs und alle
künftigen Versionen von selbst.

## 2. Die gewünschten Werkzeuge installieren

Öffne dein Projekt im Creator Companion, gehe zu **Manage Project** und installiere
beliebige FOS-Packs aus der Liste.

**Der Core installiert sich von selbst.** Jedes Pack führt FOS Essentials Core als
Abhängigkeit, in der genau benötigten Version, und der Creator Companion holt ihn dazu.
Es gibt keine Reihenfolge zu beachten und keinen Weg, ein Werkzeug ohne oder mit zu altem
Core zu erhalten.

Aktualisierungen erscheinen an derselben Stelle, wie bei jedem anderen Paket.

## 3. Wenn du ein Pack bereits von Hand installiert hast

Es gibt nichts aufzuräumen. Jedes Paket nennt den Ordner, den seine manuelle Fassung
belegte, und der Creator Companion entfernt `Assets/FOS/<Pack>` während der Installation.
Die Asset-Kennungen bleiben erhalten, eine bereits verdrahtete Szene funktioniert weiter.

Sichere dein Projekt trotzdem vorher, wie vor jeder Paketänderung.

## 4. Kostenpflichtige Packs werden manuell installiert

Ein VPM-Listing ist öffentlich, und alles, worauf es zeigt, ebenso. **Tablet System
Standard** und **Pro** werden daher als `.unitypackage`-Dateien über den Shop geliefert.

Importiere sie wie gewohnt: **Assets → Import Package → Custom Package**. Sie hängen von
kostenlosen Packs ab — installiere diese zuerst über den Creator Companion, und das Hub
sagt dir, falls etwas fehlt.

## 5. Das Hub öffnen

**FOS Essentials → Hub**, in der Menüleiste von Unity.

Das Hub ist die Schaltzentrale der gesamten Reihe: Es listet die installierten Packs,
ihre Versionen und die jeweils benötigte Core-Version auf und meldet, was fehlt.

## 6. Ein Prefab einsetzen

Jedes Pack liefert seine Prefabs in einem eigenen Untermenü:
**FOS Essentials → \<Pack\> → \<Prefab\>**.

Die Prefabs sind verdrahtet und einsatzbereit. Die Dokumentation des Packs nennt die
Felder, die du noch ausfüllen musst — meist ein Ziel-Transform, ein Canvas oder eine
Spielerliste.

## Die Sprache des Editors wählen

Das Hub hat eine Sprachauswahl: Englisch, Französisch, Spanisch und Deutsch. Sie ändert
die Inspektoren, die Tooltips und das Hub selbst. Die Wahl wird pro Rechner gespeichert,
nicht pro Projekt.
