---
title: "Welt-UI und Draw Calls in VRChat"
description: "Warum ein World-Space-Canvas Bilder kostet, obwohl niemand hinsieht, und wie Entfernungs-Culling eine UI-lastige VRChat-Welt schnell hält."
sidebar:
  order: 2
---

**Kurze Antwort:** Ein World-Space-Canvas kostet weiterhin Draw Calls und Raycasts,
solange er aktiviert ist — egal, wo die Spielenden stehen. Deaktiviere die, die außer
Reichweite sind.

## Ein Canvas, den niemand sehen kann, kostet trotzdem

Unity weiß nicht, dass deine Infotafel am anderen Ende der Karte steht. Solange ihre
`Canvas`-Komponente aktiviert ist, wird sie gebatcht, zum Rendern übergeben und — falls
sie einen `GraphicRaycaster` trägt — gegen Zeigereingaben geprüft.

In einer Welt mit zwanzig Infotafeln, Menüs und Schildern zahlen zwanzig Canvas dauerhaft
Miete, damit die zwei lesbar sind, in deren Nähe die Spielenden tatsächlich stehen.

## Den Canvas deaktivieren, nicht das GameObject

Dieser Unterschied wiegt schwerer, als er aussieht.

Ein `SetActive(false)` auf dem Elternobjekt führt beim Zurückschalten alle `OnEnable` der
Hierarchie erneut aus — auch die eines angehängten Udon-Verhaltens, das einen Zustand
zurücksetzen kann, der dir wichtig war. Nur die `Canvas`-Komponente zu deaktivieren
stoppt das Rendern und lässt alles andere unberührt.

Dasselbe gilt für den `GraphicRaycaster`: Ihn auszuschalten entfernt die Eingabekosten,
ohne etwas zu zerstören.

## Welche Entfernung soll ich wählen?

Die, ab der die UI nicht mehr lesbar ist. Bei einer Wandtafel mit Fließtext sind das oft
8 bis 15 Meter. Bei einem großen Schild deutlich mehr.

Eine Falle: Verbirgst und zeigst du bei exakt derselben Entfernung, lässt jemand, der
genau auf der Grenze steht, die UI in jedem Frame flackern. Lass einen Abstand — etwa bei
12 Metern verbergen, aber erst bei 10 wieder zeigen.

## Ohne Udon zu schreiben

[FOS UI Culling](/de/packs/ui-culling/) durchsucht deine Szene, hängt an jeden
World-Space-Canvas ein Ziel und steuert alle über einen einzigen Manager.

- **Standardentfernung** für die ganze Welt, pro UI überschreibbar.
- **Hysterese**, der oben beschriebene Abstand, gegen das Flackern an der Grenze.
- **Prüfungen pro Frame** — vier als Standard — damit eine Welt mit hundert UIs ihre
  Tests verteilt, statt sie alle auf einmal zu erledigen.
- Ein optionaler **Sichtlinien**-Durchlauf, standardmäßig aus, für UIs hinter einer Wand.

Das Pack ist kostenlos und benötigt nur [FOS Essentials Core](/de/packs/core/).
