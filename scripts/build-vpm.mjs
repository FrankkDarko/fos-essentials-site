/**
 * Fabrique les paquets VPM et le listing servi au Creator Companion.
 *
 * Un listing VPM est un JSON public qui décrit des paquets et pointe vers des
 * zips. Le VCC le lit, résout les dépendances et installe. C'est `vpmDependencies`
 * qui rend le Core obligatoire : le VCC refuse d'installer un outil sans lui et
 * le tire tout seul. Rien à coder pour cela.
 *
 * La version d'un paquet est lue **dans les sources Unity**, jamais dans
 * `packs.json`, et les deux sont comparées : une divergence arrête la
 * construction. Le 20/08/2026, le site a annoncé Core 1.1.2 et Tablet System
 * 1.6.0 alors que les packs étaient passés en 1.2.0 et 2.1.0 — publier un
 * paquet sous un mauvais numéro serait bien pire qu'une page périmée, puisque
 * le VCC le mettrait en cache chez l'acheteur.
 *
 * Usage :
 *   npm run vpm
 *   FOS_UNITY_PROJECT="D:/chemin/vers/le/projet" npm run vpm
 */

import AdmZip from 'adm-zip';
import { createHash } from 'node:crypto';
import {
	readFileSync,
	writeFileSync,
	mkdirSync,
	existsSync,
	readdirSync,
	statSync,
	rmSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const unityRoot = resolve(
	process.env.FOS_UNITY_PROJECT ??
		join(siteRoot, '..', 'French Oasis Studio Tech')
);

const packs = JSON.parse(
	readFileSync(join(siteRoot, 'src/data/packs.json'), 'utf8')
);
const site = JSON.parse(
	readFileSync(join(siteRoot, 'src/data/site.json'), 'utf8')
);

const SITE_URL = 'https://essentials.frenchoasis.studio';
const REPO = 'FrankkDarko/fos-essentials-site';
const OUT = join(siteRoot, 'dist-vpm');

/** Date figee des entrees du zip. Le format ZIP ne descend pas sous 1980. */
const EPOCH = new Date(Date.UTC(1980, 0, 1, 0, 0, 0));

/**
 * Version faisant foi, lue dans les sources Unity.
 *
 * Le Core la déclare dans une constante, les autres packs dans le second
 * argument de `[assembly: FOSTool(...)]`.
 */
function versionFromUnity(pack) {
	if (pack.id === 'core') {
		const file = join(unityRoot, pack.sourcePath, 'Runtime/FOSVersion.cs');
		const raw = readFileSync(file, 'utf8');
		const match = /CoreVersion\s*=\s*"([^"]+)"/.exec(raw);
		if (!match) throw new Error(`CoreVersion introuvable dans ${file}`);
		return match[1];
	}

	// Un pack purement editeur, comme Sync Doctor, n'a pas de dossier Runtime :
	// il declare alors son outil dans l'assembly editeur.
	const candidates = ['Runtime/AssemblyInfo.cs', 'Editor/AssemblyInfo.cs'].map(
		(rel) => join(unityRoot, pack.sourcePath, rel)
	);
	const file = candidates.find((candidate) => existsSync(candidate));
	if (!file) {
		throw new Error(`AssemblyInfo introuvable pour ${pack.id} (${candidates.join(', ')})`);
	}
	const raw = readFileSync(file, 'utf8');
	const block = /FOSTool\(([\s\S]*?)\)\]/.exec(raw);
	if (!block) throw new Error(`FOSTool introuvable dans ${file}`);
	const args = block[1].match(/"([^"]*)"/g) ?? [];
	if (args.length < 2) throw new Error(`Version introuvable dans ${file}`);
	return args[1].replace(/"/g, '');
}

/** Liste récursivement les fichiers d'un dossier. */
function walk(dir, base = dir, out = []) {
	for (const entry of readdirSync(dir).sort()) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, base, out);
		else out.push(relative(base, full).split('\\').join('/'));
	}
	return out;
}

/** Manifeste UPM du paquet, généré — jamais écrit à la main. */
function manifest(pack, version) {
	const dependencies = { 'com.vrchat.worlds': site.vrchatSdk };

	// C'est ce champ qui rend le Core obligatoire côté Creator Companion.
	if (pack.minimumCore) {
		dependencies['studio.frenchoasis.core'] = pack.minimumCore;
	}
	for (const id of pack.requires ?? []) {
		const dep = packs.find((p) => p.id === id);
		if (dep?.vpmName && dep.vpmPublished) {
			dependencies[dep.vpmName] = dep.version;
		} else if (dep) {
			// Cas d'un pack gratuit dependant d'un pack payant, absent du
			// listing : le signaler plutot que de produire un manifeste que le
			// VCC ne saura pas resoudre.
			console.warn(
				`build-vpm: ${pack.id} depend de ${id}, absent du listing — dependance omise`
			);
		}
	}

	return {
		name: pack.vpmName,
		displayName: pack.name,
		version,
		unity: '2022.3',
		description: pack.description.en,
		author: { name: site.studio, url: site.website },
		documentationUrl: `${SITE_URL}/${pack.docsSlug}/`,
		changelogUrl: `${SITE_URL}/changelogs/${pack.id}/`,
		vpmDependencies: dependencies,
		// Supprime l'installation manuelle précédente : les .meta partant dans
		// le zip, les GUID sont conservés et les scènes déjà câblées survivent.
		legacyFolders: { [`Assets/${pack.sourcePath.replace(/^Assets\//, '')}`]: '' },
	};
}

const publishable = packs.filter((p) => p.vpmName && p.vpmPublished);
if (publishable.length === 0) {
	console.error('build-vpm: aucun pack marqué vpmPublished dans packs.json');
	process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const built = [];

for (const pack of publishable) {
	const source = join(unityRoot, pack.sourcePath);
	if (!existsSync(source)) {
		console.error(`build-vpm: source absente pour ${pack.id} (${source})`);
		process.exit(1);
	}

	const version = versionFromUnity(pack);
	if (version !== pack.version) {
		console.error(
			`build-vpm: ${pack.id} — les sources Unity declarent ${version}, ` +
				`packs.json annonce ${pack.version}. Alignez-les avant de publier.`
		);
		process.exit(1);
	}

	const zip = new AdmZip();
	// package.json est a la racine du zip : le VCC extrait directement dans
	// Packages/<name>/, sans dossier intermediaire.
	zip.addFile(
		'package.json',
		Buffer.from(JSON.stringify(manifest(pack, version), null, 2) + '\n', 'utf8')
	);

	let files = 0;
	for (const relPath of walk(source)) {
		zip.addLocalFile(join(source, relPath), dirname(relPath) === '.' ? '' : dirname(relPath));
		files++;
	}

	// Zip reproductible : adm-zip inscrit sinon la date de modification de
	// chaque fichier, si bien que reconstruire un contenu identique produit une
	// empreinte differente — et invalide le zipSHA256 deja publie.
	for (const entry of zip.getEntries()) {
		entry.header.time = EPOCH;
	}

	const zipName = `${pack.vpmName}-${version}.zip`;
	const zipPath = join(OUT, zipName);
	zip.writeZip(zipPath);

	const buffer = readFileSync(zipPath);
	const sha256 = createHash('sha256').update(buffer).digest('hex');
	const tag = `${pack.id}-v${version}`;

	built.push({
		pack,
		version,
		zipName,
		sha256,
		files,
		size: buffer.length,
		url: `https://github.com/${REPO}/releases/download/${tag}/${zipName}`,
		tag,
	});

	console.log(
		`build-vpm: ${pack.vpmName} ${version} — ${files} fichiers, ` +
			`${(buffer.length / 1024).toFixed(0)} Ko`
	);
}

// --- Listing servi au Creator Companion ------------------------------

const listingPath = join(siteRoot, 'public/index.json');

// Les versions deja publiees sont conservees. Un projet dont le
// vpm-manifest.json verrouille une ancienne version ne peut plus la resoudre
// si elle disparait du listing : le Creator Companion la declare introuvable
// et le projet ne s'ouvre plus correctement. Un listing s'accumule, il ne se
// remplace pas.
const previous = existsSync(listingPath)
	? JSON.parse(readFileSync(listingPath, 'utf8'))
	: { packages: {} };

const listing = {
	name: 'FOS Essentials',
	id: 'studio.frenchoasis.vpm',
	url: `${SITE_URL}/index.json`,
	author: site.studio,
	description: 'Unity tools for VRChat worlds by French Oasis Studio.',
	infoLink: { text: 'FOS Essentials', url: SITE_URL },
	packages: structuredClone(previous.packages ?? {}),
};

for (const entry of built) {
	const slot = (listing.packages[entry.pack.vpmName] ??= { versions: {} });
	const already = slot.versions[entry.version];

	// Une version publiee est un contenu fige. Si le zip reconstruit differe de
	// celui deja annonce, c'est qu'on a modifie un pack sans changer son
	// numero : le Creator Companion refuserait l'installation sur une somme de
	// controle, ou pire, servirait deux contenus sous un meme numero.
	if (already && already.zipSHA256 !== entry.sha256) {
		console.error(
			`build-vpm: ${entry.pack.vpmName} ${entry.version} est deja publie avec ` +
				`une autre empreinte.
  publie    : ${already.zipSHA256}
  reconstruit: ${entry.sha256}
` +
				`  Montez le numero de version plutot que de remplacer un contenu publie.`
		);
		process.exit(1);
	}

	slot.versions[entry.version] = {
		...manifest(entry.pack, entry.version),
		url: entry.url,
		zipSHA256: entry.sha256,
	};
}

// Les paquets retires de la publication gardent leurs versions passees : on
// cesse d'en publier de nouvelles, on ne casse pas les projets existants.
const kept = Object.keys(listing.packages).length;
console.log(
	`build-vpm: listing — ${kept} paquet(s), ` +
		`${Object.values(listing.packages).reduce((t, p) => t + Object.keys(p.versions).length, 0)} version(s)`
);

writeFileSync(
	listingPath,
	JSON.stringify(listing, null, 2) + '\n',
	'utf8'
);

writeFileSync(
	join(OUT, 'releases.txt'),
	built
		.map((e) => `${e.tag}\t${e.zipName}\t${e.sha256}`)
		.join('\n') + '\n',
	'utf8'
);

console.log(`build-vpm: public/index.json ecrit (${built.length} paquet(s))`);
console.log('build-vpm: zips dans dist-vpm/, a joindre aux releases GitHub :');
for (const entry of built) {
	console.log(`  gh release create ${entry.tag} "dist-vpm/${entry.zipName}"`);
}
