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

	const file = join(unityRoot, pack.sourcePath, 'Runtime/AssemblyInfo.cs');
	const raw = readFileSync(file, 'utf8');
	const block = /FOSTool\(([\s\S]*?)\)\]/.exec(raw);
	if (!block) throw new Error(`FOSTool introuvable dans ${file}`);
	const args = block[1].match(/"([^"]*)"/g) ?? [];
	if (args.length < 2) throw new Error(`Version introuvable dans ${file}`);
	return args[1].replace(/"/g, '');
}

/** Liste récursivement les fichiers d'un dossier. */
function walk(dir, base = dir, out = []) {
	for (const entry of readdirSync(dir)) {
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
		if (dep?.vpmName && dep.minimumCore !== undefined) {
			dependencies[dep.vpmName] = dep.version;
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

const listing = {
	name: 'FOS Essentials',
	id: 'studio.frenchoasis.vpm',
	url: `${SITE_URL}/index.json`,
	author: site.studio,
	description: 'Unity tools for VRChat worlds by French Oasis Studio.',
	infoLink: { text: 'FOS Essentials', url: SITE_URL },
	packages: {},
};

for (const entry of built) {
	listing.packages[entry.pack.vpmName] = {
		versions: {
			[entry.version]: {
				...manifest(entry.pack, entry.version),
				url: entry.url,
				zipSHA256: entry.sha256,
			},
		},
	};
}

writeFileSync(
	join(siteRoot, 'public/index.json'),
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
