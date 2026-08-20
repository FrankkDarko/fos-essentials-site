# FOS Essentials — website & documentation

Source of [essentials.frenchoasis.studio](https://essentials.frenchoasis.studio):
the catalogue and the full documentation of the **FOS Essentials** packs, Unity
tools for VRChat worlds built on UdonSharp by
[French Oasis Studio](https://frenchoasis.studio).

Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build). Published to GitHub Pages on every
push to `main`.

## This repository does not contain the packs

The packs themselves live in a separate, private repository. What you find here
is the site: catalogue, guides, and the documentation imported from each pack.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static build into dist/
npm run preview  # serve the build
```

## Updating the pack documentation

Pack pages under `src/content/docs/packs/` and `src/content/docs/changelogs/`
are **generated** from the `README.md` and `CHANGELOG.md` of each pack. They
carry a warning header and `editUrl: false`. Editing them here is pointless —
the next sync overwrites the change.

To refresh them, with the pack sources available locally:

```sh
FOS_UNITY_PROJECT="/path/to/the/unity/project" npm run sync
```

The generated files are committed, so the site builds without access to the
pack sources. Run the sync, review the diff, then commit.

## Catalogue data

`src/data/packs.json` is the single source of truth for pack names, versions,
free or paid edition, dependencies and minimum Core version. The catalogue, the
compatibility table and the store buttons all read from it. Version numbers must
match the ones declared by the packs themselves.

## Contributing

Corrections to the guides and translations are welcome — open an issue or a pull
request. Documentation imported from the packs has to be fixed at the source
instead; open an issue and it will be corrected there.
