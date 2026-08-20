---
title: "Errores de sincronización en Udon que nunca dan error"
description: "Los fallos de red de VRChat que compilan sin problemas y parecen correctos en tu propia máquina: quienes llegan tarde, la propiedad de red y los eventos que actúan sobre el jugador equivocado."
sidebar:
  order: 5
---

**Respuesta corta:** la mayoría de los fallos de sincronización de VRChat son invisibles
mientras pruebas en solitario. Compilan, la consola calla y todo funciona — hasta que
entra un segundo jugador, o llega un tercero con retraso.

Esta página recoge los que más se repiten, qué ocurre realmente y cómo corregir cada uno.
[FOS Sync Doctor](/es/packs/sync-doctor/) es una herramienta gratuita que los encuentra en
tu proyecto y enlaza directamente con la sección de abajo que explica tu caso.

---

## Variables sincronizadas que nunca se aplican

**El síntoma.** Todo funciona entre dos jugadores presentes desde el principio. Un tercero
entra más tarde y ve el mundo en su estado inicial — puertas cerradas, luces apagadas,
contadores a cero — mientras los demás ven la realidad.

**Qué ocurre.** VRChat sí envía tus valores `[UdonSynced]` a quien acaba de llegar. Nada
en su máquina los lee. Los valores se quedan en las variables mientras la escena sigue
mostrando lo que mostraba al cargarse.

**La corrección.** Sobrescribe `OnDeserialization()` y aplica ahí el estado:

```csharp
public override void OnDeserialization()
{
    door.SetActive(_isOpen);
}
```

El mismo método debe ejecutarse cuando cambias el valor tú mismo, para que el propietario
y los remotos acaben en el mismo punto. Un único `Apply()` llamado desde ambos lados es la
forma habitual.

`[FieldChangeCallback]` es la otra respuesta correcta: el setter de la propiedad se dispara
al deserializar, así que el estado se aplica sin necesidad de `OnDeserialization`.

---

## RequestSerialization dentro de Start()

**El síntoma.** El estado inicial llega a los jugadores ya presentes y nunca a quienes
entran después.

**Qué ocurre.** VRChat documenta que una serialización solicitada desde `Start()` no llega
a quienes entran tarde. La llamada se produce demasiado pronto en la vida de red del
objeto como para conservarse.

**La corrección.** Fija tus valores iniciales en `Start()` si quieres, pero serializa
desde otro sitio — una interacción, o `OnPlayerJoined`. El propietario es el único que
debería enviar algo:

```csharp
public override void OnPlayerJoined(VRCPlayerApi player)
{
    if (Networking.IsOwner(gameObject)) RequestSerialization();
}
```

---

## Sincronización manual que nunca serializa

**El síntoma.** Tus variables cambian en tu pantalla y en ningún otro sitio.

**Qué ocurre.** `BehaviourSyncMode.Manual` no envía nada por su cuenta. Espera a
`RequestSerialization()`. Sin esa llamada, las variables son en la práctica variables
locales con un atributo decorativo.

**La corrección.** Llámalo tras cada cambio que importe. Si otro script serializa este por
ti, también vale — pero comprueba que realmente lo hace.

---

## Serializar sin ser propietario

**El síntoma.** Funciona para quien colocó el objeto y para nadie más. Sin error, sin
aviso, sin nada en el registro.

**Qué ocurre.** Solo el propietario de un objeto puede serializarlo. Llamado por cualquier
otro, `RequestSerialization()` no hace nada en silencio.

**La corrección.** Toma la propiedad antes de escribir y luego serializa:

```csharp
if (!Networking.IsOwner(Networking.LocalPlayer, gameObject))
{
    Networking.SetOwner(Networking.LocalPlayer, gameObject);
}

_isOpen = !_isOpen;
RequestSerialization();
```

---

## La sincronización continua y el tope de 200 bytes

**El síntoma.** Los valores pequeños se sincronizan bien. Añade una cadena o un array y
las actualizaciones se vuelven erráticas, o se detienen.

**Qué ocurre.** La sincronización continua está limitada a unos 200 bytes por behaviour.
Un campo de longitud variable cruza esa línea sin avisarte.

**La corrección.** Pasa a `BehaviourSyncMode.Manual`, que transporta mucho más, y serializa
cuando el valor cambia de verdad en lugar de continuamente. El modo continuo es para lo
que cambia en cada fotograma y tolera pérdidas — una plataforma móvil, no un registro de
chat.

---

## Ningún modo de sincronización declarado

**El síntoma.** Nada, hasta que alguien cambia el modo en el inspector y un mundo que
funcionaba deja de funcionar.

**Qué ocurre.** Sin `[UdonBehaviourSyncMode]` el modo vale *Any* por defecto y sigue siendo
editable instancia por instancia.

**La corrección.** Decláralo en la clase. Documenta la intención y elimina un ajuste que
nadie debería tocar:

```csharp
[UdonBehaviourSyncMode(BehaviourSyncMode.Manual)]
public class MyDoor : UdonSharpBehaviour
```

---

## Los eventos de jugador se disparan para todos

**El síntoma.** Otra persona atraviesa tu trigger y el efecto ocurre en tu pantalla.

**Qué ocurre.** `OnPlayerTriggerEnter` y sus hermanos se ejecutan en **todos** los
clientes, para **cada** jugador que entra en el volumen. Tu máquina ejecuta el manejador
cuando entra un desconocido, y `player` es ese desconocido.

**La corrección.** Filtra en la primera línea, antes que nada:

```csharp
public override void OnPlayerTriggerEnter(VRCPlayerApi player)
{
    if (!Utilities.IsValid(player) || !player.isLocal) return;

    // ...
}
```

Actuar sobre todos los jugadores es una decisión legítima — contar quién está dentro de una
zona, por ejemplo. Pero debe ser una decisión, no un descuido.

---

## Los eventos cuyo nombre empieza por guion bajo

**El síntoma.** Un evento de red que no hace absolutamente nada. Sin error, sin una línea
de registro.

**Qué ocurre.** VRChat se niega a ejecutar remotamente cualquier evento cuyo nombre empiece
por guion bajo. Esos nombres están reservados para sus propias llamadas. Tu evento sale y
se descarta al llegar.

**La corrección.** Renombra el método. Y usa la regla al revés: anteponer un guion bajo a
un método público es una forma barata de asegurarte de que **nunca** podrá dispararse
remotamente desde un cliente modificado.

---

## Un evento difundido que actúa sobre el jugador local

**El síntoma.** El que más tiempo cuesta entender. Una persona pulsa un botón de
teletransporte y se mueve la instancia entera.

**Qué ocurre.** Un evento enviado con `NetworkEventTarget.All` se ejecuta en todos los
clientes. Dentro de él, `Networking.LocalPlayer` es un jugador distinto en cada máquina.
Así que una línea pensada para moverte *a ti* mueve a quien la ejecuta — es decir, a todo
el mundo.

```csharp
// Se teletransporta todo el mundo.
public override void Interact()
{
    SendCustomNetworkEvent(NetworkEventTarget.All, nameof(DoTeleport));
}

public void DoTeleport()
{
    Networking.LocalPlayer.TeleportTo(target.position, target.rotation);
}
```

**La corrección.** Pregúntate a quién pertenece la acción.

Un teletransporte pertenece a una sola persona: no lo difundas en absoluto. Llama al método
directamente — ya se ejecuta en la máquina de quien pulsó el botón, y VRChat sincroniza su
posición por ti.

```csharp
public override void Interact()
{
    Networking.LocalPlayer.TeleportTo(target.position, target.rotation);
}
```

Los eventos difundidos son para lo que pertenece al mundo — abrir una puerta, reproducir un
efecto, iniciar una cuenta atrás. Si el cuerpo de un manejador difundido menciona
`LocalPlayer`, casi siempre es la herramienta equivocada.

---

## Probar pensando en quien llega tarde

Nada de esto aparece estando solo. La costumbre más barata, y la que más cosas atrapa:
**dos jugadores cambian el estado, un tercero entra después, y compruebas que el tercero
ve lo mismo que los otros dos.** Hazlo una vez por función y la mayoría de estos fallos
salen a la luz antes de que los encuentren tus jugadores.

[FOS Sync Doctor](/es/packs/sync-doctor/) automatiza la parte que una lista de comprobación
no puede cubrir: lee cada comportamiento sincronizado de tu proyecto y señala los casos
anteriores, distinguiendo lo que es seguro de lo que solo es probable.
