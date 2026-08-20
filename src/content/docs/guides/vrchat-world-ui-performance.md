---
title: "World UI and draw calls in VRChat"
description: "Why world-space canvases cost frames even when nobody looks at them, and how distance culling keeps a UI-heavy VRChat world fast."
sidebar:
  order: 2
---

**Short answer:** a world-space canvas keeps costing draw calls and raycasts while it is
enabled, wherever the player stands. Disable the ones that are out of range.

## A canvas nobody can see still costs something

Unity does not know that your notice board is on the other side of the map. As long as
its `Canvas` component is enabled, it is batched, submitted and — if it has a
`GraphicRaycaster` — tested against pointer input.

In a world with twenty information panels, menus and signs, that is twenty canvases
paying rent permanently so that the two the player is actually near can be read.

## Disable the canvas, not the GameObject

This distinction matters more than it looks.

`SetActive(false)` on the parent object re-runs `OnEnable` across the whole hierarchy
when it comes back — including any Udon behaviour attached to it, which may reset state
you cared about. Disabling the `Canvas` component alone stops the rendering and leaves
everything else untouched.

The same applies to the `GraphicRaycaster`: turning it off removes the input cost without
destroying anything.

## What distance should I use?

Whatever distance the UI stops being readable at. For a wall panel with body text, that
is often 8 to 15 metres. For a large sign, considerably more.

One trap: if you hide and show at exactly the same distance, a player standing on the
boundary makes the UI flicker on and off every frame. Add a margin — hide at, say, 12
metres but only show again at 10.

## Doing it without writing Udon

[FOS UI Culling](/packs/ui-culling/) scans your scene, attaches a target to every
world-space canvas and drives them all from one manager.

- **Default distance** for the whole world, overridable per UI.
- **Hysteresis**, the margin described above, to stop boundary flicker.
- **Checks per frame** — four by default — so a world with a hundred UIs spreads its
  tests instead of doing them all at once.
- An optional **line of sight** pass, off by default, for UIs behind walls.

The pack is free and requires only [FOS Essentials Core](/packs/core/).
