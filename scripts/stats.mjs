/**
 * Tableau de bord prive des telechargements, par outil.
 *
 * GitHub compte les telechargements de chaque asset de release. Le VCC passant
 * par ces memes URL, ce compteur est la seule mesure d'usage dont on dispose —
 * il n'y a pas de tele­metrie dans les packs, et il n'y en aura pas.
 *
 * Ce qu'il faut savoir avant de lire les chiffres :
 *
 * - **Un telechargement n'est pas une installation.** Le VCC met les paquets en
 *   cache : reinstaller dans un second projet ne recompte pas. A l'inverse, un
 *   curl de verification compte.
 * - **Une republication repart de zero.** Les tags suffixes `-r2`, `-r3` ont
 *   leur propre compteur ; le script les additionne par outil, mais l'historique
 *   d'une version est reparti sur plusieurs tags.
 * - **Le bruit initial est reel.** La mise au point du listing, le 20 et le
 *   21/08/2026, a telecharge chaque zip plusieurs fois pour verifier les
 *   empreintes. D'ou la remise a zero ci-dessous.
 *
 * Usage :
 *   npm run stats              # rapport terminal + dist-vpm/stats.html
 *   npm run stats -- --reset   # fixe le point zero a maintenant
 *
 * La sortie va dans dist-vpm/, qui est ignore par git : ce panneau ne quitte
 * pas la machine.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const REPO = 'FrankkDarko/fos-essentials-site';
const OUT_DIR = join(siteRoot, 'dist-vpm');
const BASELINE = join(siteRoot, 'scripts/stats-baseline.json');

const packs = JSON.parse(
	readFileSync(join(siteRoot, 'src/data/packs.json'), 'utf8')
);
const nameById = new Map(packs.map((p) => [p.id, p.name]));

/** Releases du depot, via gh pour profiter de l'authentification en place. */
function fetchReleases() {
	const raw = execFileSync(
		'gh',
		['api', `repos/${REPO}/releases?per_page=100`, '--paginate'],
		{ encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }
	);
	// --paginate concatene des tableaux JSON : on les recolle.
	return JSON.parse(raw.replace(/\]\s*\[/g, ','));
}

/** `sync-doctor-v1.2.0-r3` -> { id, version, republish }. */
function parseTag(tag) {
	const match = /^(.+)-v(\d+\.\d+\.\d+)(?:-(.+))?$/.exec(tag);
	if (!match) return null;
	return { id: match[1], version: match[2], republish: match[3] ?? null };
}

const releases = fetchReleases();
const baseline = existsSync(BASELINE)
	? JSON.parse(readFileSync(BASELINE, 'utf8'))
	: { takenAt: null, counts: {} };

/** @type {Map<string, {id:string, name:string, total:number, since:number, versions:Map<string, {total:number, since:number, tags:string[]}>}>} */
const tools = new Map();
let unparsed = 0;

for (const release of releases) {
	const parsed = parseTag(release.tag_name);
	if (!parsed) {
		unparsed++;
		continue;
	}

	const asset = release.assets?.[0];
	const count = asset?.download_count ?? 0;
	const before = baseline.counts[release.tag_name] ?? 0;
	// Un compteur ne peut pas reculer : si c'est le cas, l'asset a ete remplace
	// et on repart de la valeur actuelle plutot que d'afficher un negatif.
	const since = Math.max(0, count - before);

	const tool =
		tools.get(parsed.id) ??
		{
			id: parsed.id,
			name: nameById.get(parsed.id) ?? parsed.id,
			total: 0,
			since: 0,
			versions: new Map(),
		};

	tool.total += count;
	tool.since += since;

	const version = tool.versions.get(parsed.version) ?? {
		total: 0,
		since: 0,
		tags: [],
	};
	version.total += count;
	version.since += since;
	version.tags.push(release.tag_name);
	tool.versions.set(parsed.version, version);

	tools.set(parsed.id, tool);
}

const rows = [...tools.values()].sort((a, b) => b.since - a.since || b.total - a.total);
const totalAll = rows.reduce((t, r) => t + r.total, 0);
const sinceAll = rows.reduce((t, r) => t + r.since, 0);

// --- Remise a zero ----------------------------------------------------

if (process.argv.includes('--reset')) {
	const counts = {};
	for (const release of releases) {
		counts[release.tag_name] = release.assets?.[0]?.download_count ?? 0;
	}
	writeFileSync(
		BASELINE,
		JSON.stringify({ takenAt: new Date().toISOString(), counts }, null, 2) + '\n',
		'utf8'
	);
	console.log(`stats: point zero fixe sur ${releases.length} release(s).`);
	console.log('stats: relancez sans --reset pour voir le rapport.');
	process.exit(0);
}

// --- Rapport terminal -------------------------------------------------

const label = baseline.takenAt
	? `depuis le ${baseline.takenAt.slice(0, 10)}`
	: 'depuis toujours';

console.log('');
console.log(`  Telechargements par outil (${label})`);
console.log('  ' + '-'.repeat(58));
for (const row of rows) {
	console.log(
		'  ' +
			row.name.padEnd(30) +
			String(row.since).padStart(6) +
			'   (cumul ' + row.total + ')'
	);
}
console.log('  ' + '-'.repeat(58));
console.log('  ' + 'Total'.padEnd(30) + String(sinceAll).padStart(6) + '   (cumul ' + totalAll + ')');
if (!baseline.takenAt) {
	console.log('');
	console.log('  Aucun point zero : ces chiffres incluent les telechargements');
	console.log('  de verification. `npm run stats -- --reset` pour repartir de 0.');
}
if (unparsed) console.log(`\n  ${unparsed} release(s) au tag non reconnu, ignoree(s).`);
console.log('');

// --- Panneau HTML -----------------------------------------------------

const esc = (s) =>
	String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const body = rows
	.map((row) => {
		const versions = [...row.versions.entries()]
			.sort((a, b) => (a[0] < b[0] ? 1 : -1))
			.map(
				([version, v]) =>
					`<tr class="sub"><td>${esc(version)}<span class="tags">${v.tags
						.map((t) => esc(t))
						.join(' · ')}</span></td><td class="num">${v.since}</td><td class="num dim">${v.total}</td></tr>`
			)
			.join('');
		return `<tr class="tool"><td>${esc(row.name)}</td><td class="num">${row.since}</td><td class="num dim">${row.total}</td></tr>${versions}`;
	})
	.join('');

const html = `<!doctype html>
<meta charset="utf-8">
<title>FOS Essentials — telechargements</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; padding: 40px 28px; background: #0d1a18; color: #c3d3cf;
         font: 15px/1.5 "Segoe UI", system-ui, sans-serif; }
  .wrap { max-width: 760px; margin: 0 auto; }
  h1 { margin: 0 0 4px; font-size: 24px; color: #f0f6f5; font-weight: 600; }
  .meta { margin: 0 0 28px; color: #7f938f; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 8px 10px; font-size: 12px; font-weight: 600;
       letter-spacing: .04em; text-transform: uppercase; color: #7f938f;
       border-bottom: 1px solid #1e2f2b; }
  th.num, td.num { text-align: right; font-variant-numeric: tabular-nums; }
  td { padding: 9px 10px; border-bottom: 1px solid #162523; }
  tr.tool td { color: #f0f6f5; font-weight: 600; }
  tr.tool td.num { color: #299e8f; font-size: 17px; }
  tr.sub td { padding: 4px 10px 4px 24px; font-size: 13px; color: #93a7a3;
              border-bottom: none; }
  .dim { color: #6d817d; font-weight: 400; }
  .tags { display: block; font-size: 11px; color: #566a66; }
  .total { margin-top: 20px; padding-top: 14px; border-top: 1px solid #1e2f2b;
           display: flex; justify-content: space-between; font-size: 17px;
           color: #f0f6f5; font-weight: 600; }
  .note { margin-top: 30px; padding: 14px 16px; border-left: 3px solid #299e8f;
          background: #122623; font-size: 13px; color: #a8bbb7; }
</style>
<div class="wrap">
  <h1>Telechargements par outil</h1>
  <p class="meta">${esc(label)} · genere le ${new Date().toISOString().slice(0, 16).replace('T', ' ')} · source : compteurs GitHub Releases</p>
  <table>
    <thead><tr><th>Outil</th><th class="num">${baseline.takenAt ? 'Depuis le point zero' : 'Total'}</th><th class="num">Cumul</th></tr></thead>
    <tbody>${body}</tbody>
  </table>
  <div class="total"><span>Total</span><span>${sinceAll}${baseline.takenAt ? ` <span class="dim">/ ${totalAll}</span>` : ''}</span></div>
  <div class="note">
    Un telechargement n'est pas une installation : le Creator Companion met les
    paquets en cache, donc reinstaller dans un second projet ne recompte pas.
    A l'inverse, chaque verification d'empreinte en ligne de commande compte.
    ${baseline.takenAt ? '' : 'Aucun point zero fixe : ces chiffres incluent la mise au point du listing.'}
  </div>
</div>
`;

mkdirSync(OUT_DIR, { recursive: true });
const outPath = join(OUT_DIR, 'stats.html');
writeFileSync(outPath, html, 'utf8');
console.log(`  panneau : ${outPath}`);
console.log('');
