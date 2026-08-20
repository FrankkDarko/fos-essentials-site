---
title: "Eine VRChat-Welt mehrsprachig machen"
description: "Wie man Texte und Bilder einer VRChat-Welt übersetzt, warum parallele Arrays irgendwann brechen, und wie man die Sprachwahl über Besuche hinweg merkt."
sidebar:
  order: 3
---

**Kurze Antwort:** Halte alle Sprachen einer Zeichenkette in einer einzigen Zeile
zusammen, nicht in getrennten Arrays, und merke dir die Wahl der Spielenden, damit sie
sie nie zweimal treffen müssen.

## Warum die meisten Übersetzungslösungen verrotten

Der erste Versuch sieht immer gleich aus: zwei Arrays, eines mit Schlüsseln, eines mit
übersetzten Zeichenketten, und derselbe Index in beiden. Das funktioniert, bis jemand in
das eine eine Zeile einfügt und in das andere nicht. Ab da ist jede Übersetzung um eins
verschoben, und nichts meldet einen Fehler — die Welt zeigt einfach den falschen Text.

Das Problem ist strukturell: Nichts verbindet einen Schlüssel mit seinen Übersetzungen
außer einer Zahl, die jede Bearbeitung zerstören kann.

Eine Tabelle, in der eine Zeile den Schlüssel **und** alle seine Sprachen trägt, kann
nicht auseinanderlaufen, weil es keine zweite Liste gibt, die man im Gleichschritt halten
müsste.

## Text allein reicht selten

Schilder, Poster, Regeltafeln und UI-Schaltflächen sind oft Bilder mit eingebranntem
Text. Ein Übersetzungssystem, das nur Zeichenketten austauscht, lässt die halbe Welt in
einer Sprache stehen.

Was du einsetzt, sollte ein **Sprite oder eine Textur** über denselben
Schlüsselmechanismus austauschen können wie eine Zeichenkette.

## Die Wahl merken

Wiederkehrende Besuchende bei jedem Besuch erneut nach ihrer Sprache zu fragen, ist genau
das Detail, das eine Welt unfertig wirken lässt.

Das VRChat-SDK bietet dafür seit Version 3.10 `PlayerData`: Die Angabe bleibt pro Person
über Sitzungen hinweg erhalten, ganz ohne die früheren Behelfslösungen.

## Und der Editor selbst?

Zwei Dinge lohnt es zu trennen:

- **Der Text der Welt**, den Besuchende sehen — darum geht es auf dieser Seite.
- **Die Werkzeuge, mit denen du baust**, die du und dein Team im Unity-Inspektor seht.

FOS Essentials übersetzt beides. Inspektoren, Tooltips und Menüs gibt es auf Englisch,
Französisch, Spanisch und Deutsch, pro Rechner im Hub wählbar.

## Ohne Udon zu schreiben

[FOS Localization](/de/packs/localization/) gibt dir einen echten Tabelleneditor: eine
Zeile je Schlüssel, eine Spalte je Sprache, für Texte wie für Bilder. Es importiert und
exportiert **CSV**, sodass Übersetzende in einer Tabellenkalkulation arbeiten und die
Datei zurückgeben können, und es merkt sich die Sprachwahl über Besuche hinweg.

Das Pack ist kostenlos und benötigt nur [FOS Essentials Core](/de/packs/core/).
