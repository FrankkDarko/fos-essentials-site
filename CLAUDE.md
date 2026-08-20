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
