/**
 * Génère les cartes sociales (Open Graph) du site.
 *
 * Une image par pack, plus une carte par défaut pour les pages générales.
 * Sans elles, le `twitter:card summary_large_image` posé par Starlight annonce
 * une grande image et n'en fournit aucune : chaque partage Discord ou X affiche
 * une carte vide.
 *
 * Les images sont écrites dans `public/og/` et **committées**, comme la
 * documentation importée : le build tourne chez GitHub et ne doit dépendre ni
 * des polices ni des sources locales.
 *
 * Usage : npm run og
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const packs = JSON.parse(readFileSync(join(root, 'src/data/packs.json'), 'utf8'));

const W = 1200;
const H = 630;
const BG = '#0f1115';
const ACCENT = '#299e8f';
const WHITE = '#f4f6f7';
const GREY = '#9aa4ad';

const OUT = join(root, 'public/og');
mkdirSync(OUT, { recursive: true });

/** Échappe le texte pour l'insérer dans du XML. */
function xml(text) {
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/**
 * Découpe un texte en lignes.
 *
 * SVG ne sait pas revenir à la ligne tout seul : la largeur est estimée à
 * partir d'une largeur moyenne de glyphe, ce qui suffit pour une carte.
 */
function wrap(text, maxChars, maxLines) {
	const words = String(text).split(/\s+/);
	const lines = [];
	let line = '';
	for (const word of words) {
		const candidate = line ? `${line} ${word}` : word;
		if (candidate.length > maxChars && line) {
			lines.push(line);
			line = word;
			if (lines.length === maxLines) break;
		} else {
			line = candidate;
		}
	}
	if (lines.length < maxLines && line) lines.push(line);
	if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
		lines[maxLines - 1] = lines[maxLines - 1].replace(/[,.;:]?$/, '') + '…';
	}
	return lines;
}

const logo = await sharp(join(root, 'src/assets/logo.png'))
	.resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
	.png()
	.toBuffer();

/** Compose une carte : titre, description, badge d'édition optionnel. */
async function card(name, { title, subtitle, badge }) {
	const titleLines = wrap(title, 26, 2);
	const subtitleLines = wrap(subtitle, 58, 3);

	const titleSvg = titleLines
		.map(
			(l, i) =>
				`<text x="88" y="${268 + i * 74}" font-family="Segoe UI, DejaVu Sans, sans-serif" font-size="66" font-weight="700" fill="${WHITE}">${xml(l)}</text>`
		)
		.join('');

	const subtitleSvg = subtitleLines
		.map(
			(l, i) =>
				`<text x="88" y="${268 + titleLines.length * 74 + 34 + i * 40}" font-family="Segoe UI, DejaVu Sans, sans-serif" font-size="29" fill="${GREY}">${xml(l)}</text>`
		)
		.join('');

	const badgeSvg = badge
		? `<rect x="88" y="128" width="${28 + badge.length * 15}" height="42" rx="21" fill="${ACCENT}" fill-opacity="0.18"/>
		   <text x="${102}" y="157" font-family="Segoe UI, DejaVu Sans, sans-serif" font-size="24" font-weight="600" fill="${ACCENT}">${xml(badge)}</text>`
		: '';

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
		<rect width="${W}" height="${H}" fill="${BG}"/>
		<rect x="0" y="0" width="14" height="${H}" fill="${ACCENT}"/>
		${badgeSvg}
		${titleSvg}
		${subtitleSvg}
		<text x="88" y="562" font-family="Segoe UI, DejaVu Sans, sans-serif" font-size="26" font-weight="600" fill="${ACCENT}">FOS Essentials</text>
		<text x="270" y="562" font-family="Segoe UI, DejaVu Sans, sans-serif" font-size="24" fill="${GREY}">essentials.frenchoasis.studio</text>
	</svg>`;

	await sharp(Buffer.from(svg))
		.composite([{ input: logo, top: 74, left: 1010 }])
		.png({ compressionLevel: 9 })
		.toFile(join(OUT, `${name}.png`));

	return name;
}

const made = [];

made.push(
	await card('default', {
		title: 'Unity tools for VRChat worlds',
		subtitle:
			'UdonSharp packs for VRChat world creators: mirrors, teleports, UI culling, localization and moderation.',
	})
);

for (const pack of packs) {
	made.push(
		await card(pack.id, {
			title: pack.shortName,
			subtitle: pack.description.en,
			badge: pack.edition === 'free' ? 'FREE' : 'PAID',
		})
	);
}

console.log(`gen-og: ${made.length} card(s) written to public/og/`);
