# FOS Essentials — site public

Site vitrine + documentation de la ligne **FOS Essentials**, publié sur GitHub
Pages à `essentials.frenchoasis.studio`. Langue de travail : **français**
(commentaires, ce fichier). Tout ce qui est publié est en **anglais**, avec
traductions FR / ES / DE.

Dépôt **public**. Le dépôt Unity `fos-essentials` reste **privé** et fait foi.

---

## 1. Stack

| Élément | Valeur |
|---|---|
| Astro | 7.x |
| Starlight | 0.41.x |
| Node | 22 |
| Hébergement | GitHub Pages, workflow `.github/workflows/deploy.yml` |
| Domaine | `essentials.frenchoasis.studio` (fichier `public/CNAME`) |

## 2. Règles absolues

- **Aucun code de pack payant dans ce dépôt.** Il est public. Tablet System
  Standard et Pro ne doivent jamais y apparaître, même partiellement.
- **Ne jamais éditer à la main** `src/content/docs/packs/*` ni
  `src/content/docs/changelogs/*` : ces fichiers sont générés par
  `scripts/sync-packs.mjs` depuis les `README.md` / `CHANGELOG.md` du dépôt
  Unity. Une correction se fait **à la source**, puis on resynchronise.
- **La liste des boutiques de `src/data/site.json` recopie celle de
  `FOSBrandingSettings.asset`** (dépôt Unity, `Assets/FOS/Core/Editor/Branding/`). Le Hub
  et le site doivent proposer les mêmes enseignes : un acheteur qui voit quatre boutiques
  dans l'éditeur et trois sur le site se demande laquelle ment. Vérifier les deux quand
  une enseigne est ajoutée ou qu'une URL change.
- **`src/data/packs.json` est la source de vérité unique** du catalogue :
  version, édition gratuite/payante, dépendances, Core minimum. Aucune de ces
  valeurs ne doit être réécrite en dur dans une page ou un composant.
- **Les versions doivent concorder** avec celles déclarées dans les
  `[assembly: FOSTool(...)]` du dépôt Unity. Les faire diverger rend le site
  menteur, exactement comme le Hub.

## 3. Synchronisation de la documentation

```sh
FOS_UNITY_PROJECT="D:/chemin/vers/French Oasis Studio Tech" npm run sync
```

Le résultat est **committé** : le build GitHub Actions n'a pas accès au dépôt
Unity privé, il ne peut donc pas régénérer ces pages lui-même. C'est pourquoi
`npm run build` ne lance PAS la synchro.

Ordre à respecter quand un pack change :
1. le pack est validé dans le dépôt Unity (version + changelog à jour) ;
2. on met à jour `src/data/packs.json` ici ;
3. `npm run sync` ;
4. `npm run build` pour vérifier ;
5. commit.

### Ajouter un pack au catalogue

`npm run sync` enchaîne desormais `scripts/gen-og.mjs` : ajouter une entrée dans
`packs.json` puis lancer la synchro suffit à produire sa carte sociale en même temps que
sa documentation.

⚠ Ne jamais ajouter un pack sans relancer la synchro. `Head.astro` déclare
`og:image` pour **tous** les packs de `packs.json` : une entrée sans carte fait pointer
la balise vers une image inexistante. La page se charge normalement, rien n'échoue au
build, et le défaut ne se voit qu'au premier partage Discord. C'est arrivé le 20/08/2026
avec FOS Sync Doctor.

## 4bis. Publier une mise a jour d'un pack au listing VPM

L'ordre compte, et deux etapes sont irreversibles.

```sh
# 1. Depot Unity : version montee et validee (AssemblyInfo/FOSVersion,
#    CHANGELOG, README), commit fait.
# 2. Ici : reporter la version dans src/data/packs.json
npm run sync     # doc, changelogs, cartes sociales
npm run vpm      # zips + index.json, avec verification des versions
# 3. Publier la release AVANT de pousser le site
gh release create <id>-v<version> "dist-vpm/<vpmName>-<version>.zip"
npm run build
git commit && git push
```

**La release doit exister avant que le listing ne soit en ligne.** Sinon `index.json`
pointe vers un zip absent, et toute installation tentee pendant ce laps de temps echoue.

### Ce qui est irreversible

⚠ **Ne jamais republier un numero de version avec un contenu different.** Le Creator
Companion verifie le `zipSHA256` : deux contenus sous un meme numero, c'est une
installation refusee chez celui qui a l'ancien en cache. `build-vpm.mjs` compare le zip
reconstruit a celui deja annonce dans `index.json` et refuse de continuer. Montez le
numero, c'est tout.

⚠ **Ne jamais retirer une version du listing, ni supprimer sa release GitHub.** Un projet
dont le `vpm-manifest.json` verrouille cette version ne peut plus la resoudre : le VCC la
declare introuvable. Le listing **s'accumule**, il ne se remplace pas — le script conserve
donc les versions deja presentes dans `public/index.json`. Cesser de publier un pack se
fait en passant `vpmPublished` a `false`, ce qui arrete les nouvelles versions sans
retirer les anciennes.

### Pieges rencontres le 20/08/2026

- **Construction reproductible.** `adm-zip` inscrit la date de modification de chaque
  fichier : sans horodatage fige ni tri du parcours, reconstruire un contenu identique
  produisait une empreinte differente et invalidait le `zipSHA256` publie. C'est regle
  dans le script, ne pas le defaire.
- **Cache de GitHub.** Apres remplacement d'un asset de release, l'URL de telechargement a
  servi l'ancien fichier pendant une vingtaine de minutes, y compris apres suppression et
  recreation de la release. Raison de plus pour ne jamais remplacer un contenu publie.
- **`dist-vpm/` est vide a chaque construction.** N'y rangez rien que vous vouliez garder.

## 4. Localisation

L'anglais occupe la racine du site, les autres langues vivent sous `/fr`, `/es`,
`/de`. Une page non traduite **retombe automatiquement sur l'anglais** : on peut
donc publier une page anglaise seule sans casser les autres langues.

- Textes des pages : un fichier par langue sous `src/content/docs/<lang>/`.
- Textes des composants : table `UI` dans `src/i18n.ts`, les 4 langues à la fois.
- Descriptions des packs : les 4 langues dans `packs.json`, reprises telles
  quelles de `FOSCoreStrings.cs` côté Unity.

## 5. Pièges rencontrés

- **Starlight ≥ 0.39** : un groupe de sidebar `autogenerate` doit être enveloppé
  dans `items: [{ autogenerate: { directory: '...' } }]`. L'ancienne forme
  `label` + `autogenerate` au même niveau est rejetée à la configuration.
- **Le logo du Core fait 4096×4096 pour 15 Mo.** Il est redimensionné à 512 px
  avant d'entrer ici. Ne jamais recopier le PNG d'origine dans le dépôt.
