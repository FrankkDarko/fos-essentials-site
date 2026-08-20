---
title: "Udon-Sync-Fehler, die nie einen Fehler melden"
description: "Die VRChat-Netzwerkfehler, die sauber kompilieren und auf dem eigenen Rechner richtig aussehen: spät Hinzukommende, Ownership und Events, die auf die falsche Person wirken."
sidebar:
  order: 5
---

**Kurze Antwort:** Die meisten VRChat-Sync-Fehler sind unsichtbar, solange du allein
testest. Sie kompilieren, die Konsole bleibt still, und alles funktioniert — bis eine
zweite Person beitritt oder eine dritte verspätet ankommt.

Diese Seite listet die häufigsten auf, erklärt, was wirklich passiert, und wie sich jeder
beheben lässt. [FOS Sync Doctor](/de/packs/sync-doctor/) ist ein kostenloses Werkzeug, das
sie in deinem Projekt findet und direkt auf den Abschnitt unten verweist, der deinen Fall
erklärt.

---

## Synchronisierte Variablen, die nie angewendet werden

**Das Symptom.** Zwischen zwei Personen, die von Anfang an dabei sind, funktioniert alles.
Eine dritte tritt später bei und sieht die Welt im Ausgangszustand — Türen zu, Lichter
aus, Zähler auf null — während alle anderen den echten Zustand sehen.

**Was passiert.** VRChat sendet deine `[UdonSynced]`-Werte sehr wohl an die neu
hinzugekommene Person. Nur liest sie auf deren Rechner niemand. Die Werte liegen in den
Variablen, während die Szene weiter zeigt, was sie beim Laden zeigte.

**Die Behebung.** Überschreibe `OnDeserialization()` und wende den Zustand dort an:

```csharp
public override void OnDeserialization()
{
    door.SetActive(_isOpen);
}
```

Dieselbe Methode muss laufen, wenn du den Wert selbst änderst, damit Besitz und Remote am
selben Punkt landen. Ein einziges `Apply()`, von beiden Seiten aufgerufen, ist die übliche
Form.

`[FieldChangeCallback]` ist die andere richtige Antwort: Der Setter der Eigenschaft löst
beim Deserialisieren aus, sodass der Zustand ganz ohne `OnDeserialization` angewendet wird.

---

## RequestSerialization in Start()

**Das Symptom.** Der Anfangszustand erreicht die bereits Anwesenden und nie diejenigen,
die danach beitreten.

**Was passiert.** VRChat dokumentiert, dass eine aus `Start()` angeforderte Serialisierung
spät Hinzukommende nicht erreicht. Der Aufruf erfolgt zu früh im Netzwerkleben des
Objekts, um erhalten zu bleiben.

**Die Behebung.** Setze deine Anfangswerte ruhig in `Start()`, aber serialisiere von
woanders — bei einer Interaktion oder in `OnPlayerJoined`. Nur wer das Objekt besitzt,
sollte etwas senden:

```csharp
public override void OnPlayerJoined(VRCPlayerApi player)
{
    if (Networking.IsOwner(gameObject)) RequestSerialization();
}
```

---

## Manuelle Synchronisierung, die nie serialisiert

**Das Symptom.** Deine Variablen ändern sich auf deinem Bildschirm und sonst nirgends.

**Was passiert.** `BehaviourSyncMode.Manual` sendet von sich aus nichts. Es wartet auf
`RequestSerialization()`. Ohne diesen Aufruf sind die Variablen praktisch lokale Variablen
mit einem dekorativen Attribut.

**Die Behebung.** Rufe es nach jeder Änderung auf, die zählt. Wenn ein anderes Skript
dieses für dich serialisiert, ist das ebenfalls in Ordnung — aber prüfe, ob es das
wirklich tut.

---

## Serialisieren ohne Besitz

**Das Symptom.** Es funktioniert für die Person, die das Objekt platziert hat, und für
sonst niemanden. Kein Fehler, keine Warnung, nichts im Protokoll.

**Was passiert.** Nur wer ein Objekt besitzt, kann es serialisieren. Von allen anderen
aufgerufen, tut `RequestSerialization()` stillschweigend nichts.

**Die Behebung.** Übernimm den Besitz vor dem Schreiben und serialisiere dann:

```csharp
if (!Networking.IsOwner(Networking.LocalPlayer, gameObject))
{
    Networking.SetOwner(Networking.LocalPlayer, gameObject);
}

_isOpen = !_isOpen;
RequestSerialization();
```

---

## Continuous-Sync und die 200-Byte-Grenze

**Das Symptom.** Kleine Werte synchronisieren sauber. Füge eine Zeichenkette oder ein
Array hinzu, und die Aktualisierungen werden unregelmäßig oder hören auf.

**Was passiert.** Continuous-Sync ist auf etwa 200 Byte pro Behaviour begrenzt. Ein Feld
variabler Länge überschreitet diese Grenze, ohne dir Bescheid zu sagen.

**Die Behebung.** Wechsle zu `BehaviourSyncMode.Manual`, das deutlich mehr trägt, und
serialisiere, wenn sich der Wert tatsächlich ändert, statt fortlaufend. Continuous ist für
Dinge gedacht, die sich in jedem Frame ändern und Verluste verkraften — eine fahrende
Plattform, kein Chatprotokoll.

---

## Kein Sync-Modus deklariert

**Das Symptom.** Nichts — bis jemand den Modus im Inspektor ändert und eine Welt, die
funktionierte, aufhört zu funktionieren.

**Was passiert.** Ohne `[UdonBehaviourSyncMode]` gilt standardmäßig *Any*, und der Modus
bleibt je Instanz änderbar.

**Die Behebung.** Deklariere ihn an der Klasse. Das dokumentiert die Absicht und entfernt
eine Einstellung, an die niemand rühren sollte:

```csharp
[UdonBehaviourSyncMode(BehaviourSyncMode.Manual)]
public class MyDoor : UdonSharpBehaviour
```

---

## Spieler-Events feuern bei allen

**Das Symptom.** Jemand anderes läuft durch deinen Trigger, und der Effekt passiert auf
deinem Bildschirm.

**Was passiert.** `OnPlayerTriggerEnter` und Verwandte laufen auf **jedem** Client, für
**jede** Person, die das Volumen betritt. Dein Rechner führt den Handler aus, wenn eine
fremde Person hineinläuft, und `player` ist diese fremde Person.

**Die Behebung.** Filtere in der ersten Zeile, vor allem anderen:

```csharp
public override void OnPlayerTriggerEnter(VRCPlayerApi player)
{
    if (!Utilities.IsValid(player) || !player.isLocal) return;

    // ...
}
```

Auf alle zu reagieren ist eine legitime Entscheidung — etwa um zu zählen, wer sich in einer
Zone befindet. Aber es sollte eine Entscheidung sein, kein Versehen.

---

## Events, deren Name mit einem Unterstrich beginnt

**Das Symptom.** Ein Netzwerkereignis, das absolut nichts tut. Kein Fehler, keine
Protokollzeile.

**Was passiert.** VRChat weigert sich, ein Event, dessen Name mit einem Unterstrich
beginnt, aus der Ferne auszuführen. Diese Namen sind für die eigenen Callbacks reserviert.
Dein Aufruf geht raus und wird beim Empfang verworfen.

**Die Behebung.** Benenne die Methode um. Und nutze die Regel umgekehrt: Einer öffentlichen
Methode einen Unterstrich voranzustellen ist ein günstiger Weg, sicherzustellen, dass sie
**niemals** von einem veränderten Client aus der Ferne ausgelöst werden kann.

---

## Ein gesendetes Event, das auf die lokale Person wirkt

**Das Symptom.** Der Fehler, dessen Verständnis am meisten Zeit kostet. Eine Person drückt
einen Teleport-Knopf, und die gesamte Instanz wird versetzt.

**Was passiert.** Ein mit `NetworkEventTarget.All` gesendetes Event läuft auf jedem
Client. Darin bezeichnet `Networking.LocalPlayer` auf jedem Rechner eine andere Person.
Eine Zeile, die *dich* bewegen soll, bewegt also die Person, die sie ausführt — und das
sind alle.

```csharp
// Alle werden teleportiert.
public override void Interact()
{
    SendCustomNetworkEvent(NetworkEventTarget.All, nameof(DoTeleport));
}

public void DoTeleport()
{
    Networking.LocalPlayer.TeleportTo(target.position, target.rotation);
}
```

**Die Behebung.** Frage dich, wem die Aktion gehört.

Ein Teleport gehört einer einzigen Person: Sende ihn gar nicht erst. Rufe die Methode
direkt auf — sie läuft ohnehin auf dem Rechner der Person, die gedrückt hat, und VRChat
synchronisiert deren Position für dich.

```csharp
public override void Interact()
{
    Networking.LocalPlayer.TeleportTo(target.position, target.rotation);
}
```

Gesendete Events sind für das gedacht, was der Welt gehört — eine Tür öffnen, einen Effekt
abspielen, einen Countdown starten. Erwähnt der Rumpf eines gesendeten Handlers
`LocalPlayer`, ist es fast immer das falsche Werkzeug.

---

## Für spät Hinzukommende testen

Nichts davon zeigt sich allein. Die günstigste Gewohnheit, die das meiste abfängt: **zwei
Personen ändern den Zustand, eine dritte tritt danach bei, und du prüfst, ob die dritte
sieht, was die beiden anderen sehen.** Mache das einmal pro Funktion, und die Mehrzahl
dieser Fehler kommt ans Licht, bevor deine Besuchenden sie finden.

[FOS Sync Doctor](/de/packs/sync-doctor/) automatisiert den Teil, den eine Checkliste nicht
abdecken kann: Es liest jedes synchronisierte Verhalten deines Projekts und meldet die
obigen Fälle — und unterscheidet dabei, was sicher ist und was nur wahrscheinlich.
