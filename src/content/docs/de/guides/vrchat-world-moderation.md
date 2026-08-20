---
title: "Eine VRChat-Welt moderieren"
description: "Was Weltenbauende gegen störende Besuchende in VRChat tun können und was nicht, und wie In-World-Moderationswerkzeuge mit Rollen tatsächlich funktionieren."
sidebar:
  order: 4
---

**Kurze Antwort:** Wer eine Welt baut, kann niemanden aus VRChat verbannen — wohl aber
bestimmen, was in der eigenen Welt geschieht: wer sich bewegt, wer gehört wird und wer
was sieht.

## Was tatsächlich in deiner Macht steht

Kontosperren sind Sache von VRChat. Was eine Welt tun kann, ist auf die Person
einzuwirken, *solange sie sich darin aufhält*:

| Aktion | Was sie in einer Welt bedeutet |
|---|---|
| Bewegung sperren | Die Fortbewegung wird entzogen, die Person bleibt, wo sie ist |
| Isolieren | Die Person wird in einen abgetrennten Bereich versetzt, weg von allen |
| Stummschalten | Ihre Sprachreichweite wird für die anderen auf null gesetzt |
| Zurücksetzen | Ihre normalen Bewegungs- und Sprachwerte werden zurückgegeben |

Nichts davon folgt der Person aus deiner Welt hinaus. Es endet in dem Moment, in dem sie
geht — und genau das ist der richtige Geltungsbereich für ein Weltwerkzeug.

## Warum Rollen wichtiger sind als Schaltflächen

Das Schwierige ist nicht, jemanden festzusetzen. Es ist die Entscheidung, **wer das
darf**.

Ein Moderationspanel, das jede und jeder öffnen kann, ist schlimmer als gar keines. Du
brauchst mindestens eine Trennung zwischen Weltbesitz, vertrautem Team und gewöhnlichen
Besuchenden — und in den meisten Gemeinschaften noch feinere Abstufungen: jemand, der
stummschalten, aber nicht teleportieren darf; eine Führung, die Besuchende versetzen,
aber nicht verstummen lassen kann.

## Die Falle beim Zurücksetzen

Jemanden festzusetzen heißt, dessen Bewegungswerte zu überschreiben. Die Sperre
aufzuheben heißt, Werte zurückzuschreiben — und was du zurückschreibst, ist das, was die
Person bekommt, nicht das, was sie hatte.

Das zählt, weil Avatare und Welten diese Werte aus guten Gründen verändern. Fest
verdrahtete Standardwerte zurückzuschreiben kann jemandem eine Gehgeschwindigkeit
hinterlassen, die er nie hatte. Lege die normalen Werte deiner Welt bewusst fest und
stelle **diese** wieder her.

## Wer später kommt, sieht nichts

Ein wichtiges Detail des VRChat-Netzwerks: Ein Netzwerkereignis wird für später
Hinzukommende nicht wiederholt. Lebt der Moderationszustand nur in Ereignissen, sieht
jemand, der nach einer Bewegungssperre beitritt, die gesperrte Person normal umherlaufen.

Jedes Werkzeug, auf das du dich verlässt, muss seinen vollständigen Zustand beim Beitritt
aus synchronisierten Variablen wiederherstellen — sonst sehen deine Moderation und deine
Besuchenden nicht dieselbe Welt.

## Ohne Udon zu schreiben

[FOS Tablet System](/de/packs/tablet-system/) ist ein Tablet, das sich Spielende vor sich
holen: Teleport-Menü, lokale Schalter, Weltregeln und ein vollständiges Moderationspanel
mit Rollen, Bewegungssperre, Isolation, Stummschaltung und synchronisiertem Protokoll.
Die Rückstellwerte sind Felder, die du setzt, keine versteckten Standardwerte.

Die [Pro-Edition](/de/packs/tablet-system-pro/) ersetzt die vier festen Rollen durch so
viele, wie deine Welt braucht, jede mit eigenen Rechten, dazu Rollen je Konto,
Sichtbarkeit je Rolle und Spawnpunkte je Rolle.

Beide sind kostenpflichtig. Sie benötigen [FOS Essentials Core](/de/packs/core/),
[FOS Localization](/de/packs/localization/) und [FOS Teleport](/de/packs/teleport/), die
kostenlos sind.
