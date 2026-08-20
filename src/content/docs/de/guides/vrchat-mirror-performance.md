---
title: "Spiegel und Bildrate in VRChat-Welten"
description: "Warum ein Spiegel in einer VRChat-Welt so viel kostet, was er tatsächlich rendert, und wie man Spiegel behält, ohne die Leistung auf PC und Quest zu ruinieren."
sidebar:
  order: 1
---

**Kurze Antwort:** Ein Spiegel lässt die Szene ein zweites Mal rendern, einmal pro Auge.
Einen dauerhaft eingeschaltet zu lassen ist der häufigste Grund dafür, dass eine
VRChat-Welt schlecht läuft. Behalte deine Spiegel, aber **standardmäßig ausgeschaltet**,
und lass die Spielenden den einschalten, den sie brauchen.

## Warum ist ein Spiegel so teuer?

Ein Spiegel ist keine Textur. Er ist eine zweite Kamera, die deine Szene aus der
gespiegelten Perspektive rendert — und in VR einmal pro Auge. Eine Welt, die ohne Spiegel
mit 90 Bildern pro Sekunde läuft, rendert **dreimal pro Bild**, sobald ein Spiegel
sichtbar ist: linkes Auge, rechtes Auge und die Spiegelung für jedes davon.

Die Kosten hängen davon ab, was der Spiegel sehen kann. Ein Spiegel vor einer leeren Wand
ist günstig. Ein Spiegel vor deinem gesamten Hauptraum, mit allen Avataren darin, ist es
nicht.

## Was die Kosten wirklich senkt

Grob nach Wirkung geordnet:

1. **Standardmäßig aus.** Ein Spiegel, den niemand eingeschaltet hat, kostet nichts.
2. **Weniger Layer.** Ein Spiegel, der nur Avatare und Spielende spiegelt, überspringt
   deine gesamte Umgebung. Das ist meist der größte Gewinn nach dem Ausschalten.
3. **Geringere Auflösung.** Halbe Auflösung ist in VR oft nicht zu unterscheiden, wenn der
   Spiegel dazu dient, einen Avatar zu prüfen.
4. **Kleinere Spiegel, die weniger sehen.** Geometrie zählt: Was der Spiegel sieht, muss
   er rendern.

Keine Einstellung macht einen Spiegel kostenlos. Wer das behauptet, beschreibt in
Wahrheit einen der vier Punkte oben.

## Sollen Spiegel an sein, wenn jemand ankommt?

Nein. Das ist der teuerste denkbare Standard, und die meisten Besuchenden benutzen nie
einen Spiegel. Gib ihnen stattdessen einen sichtbaren Schalter: eine Schaltfläche am
Rahmen oder eine Interaktion am Spiegel selbst.

Die Ausnahme ist eine Welt zum Avatar-Testen, in der der Spiegel *der* Inhalt ist.

## Ist das auf Quest anders?

Ja, erheblich. Ein autarkes Headset hat einen Bruchteil des GPU-Budgets eines PCs, und
Spiegel sind der schnellste Weg, es aufzubrauchen. Wenn deine Welt auf beiden Plattformen
erscheint, mach Quest zur Randbedingung, die die Standardwerte bestimmt: aus, niedrige
Auflösung, minimale Layer.

## Ohne Udon zu schreiben

[FOS Mirror](/de/packs/mirror/) ist genau dafür gebaut. Ein Manager durchsucht die Szene,
findet jeden VRChat-Spiegel und übernimmt ihn. Spiegel schalten sich nach Entfernung, per
UI-Schaltfläche oder per Interaktion ein, und ein **Exklusivmodus** stellt sicher, dass
immer nur einer an ist.

Zwei Details, die in der Praxis zählen:

- Geschaltet wird die **Komponente** `VRC_MirrorReflection`, nie das GameObject. Das
  Objekt zu deaktivieren würde alle `OnEnable` der Hierarchie erneut ausführen,
  Udon-Skripte eingeschlossen, und den dekorativen Rahmen mit der Spiegelung verstecken.
- Die Komponente an jedem Spiegel leistet **keine Arbeit pro Frame**. Der Manager besitzt
  die einzige Schleife: mehr Spiegel bedeuten keine zusätzlichen Update-Kosten.

Das Pack ist kostenlos und benötigt nur [FOS Essentials Core](/de/packs/core/).
