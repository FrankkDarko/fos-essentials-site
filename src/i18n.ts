/**
 * Petit helper de langue pour les composants du catalogue.
 *
 * Starlight gère la langue des pages de contenu tout seul, mais les composants
 * qui rendent des données (`packs.json`) doivent la déduire eux-mêmes. Comme
 * l'anglais occupe la racine du site, l'URL n'a pas de préfixe `/en/` : tout
 * chemin dont le premier segment n'est pas une langue connue est de l'anglais.
 */

export const LANGS = ['en', 'fr', 'es', 'de'] as const;
export type Lang = (typeof LANGS)[number];

const PREFIXED = ['fr', 'es', 'de'] as const;

export function langFromPath(pathname: string): Lang {
	const first = pathname.split('/').filter(Boolean)[0];
	return (PREFIXED as readonly string[]).includes(first) ? (first as Lang) : 'en';
}

/** Préfixe un slug interne de la langue courante. */
export function localized(lang: Lang, slug: string): string {
	const clean = slug.replace(/^\/+|\/+$/g, '');
	return lang === 'en' ? `/${clean}/` : `/${lang}/${clean}/`;
}

type Dict = Record<string, string>;

export const UI: Record<Lang, Dict> = {
	en: {
		navDownload: 'Download',
		navPacks: 'Packs',
		navGuides: 'Guides',
		navFaq: 'FAQ',
		navLabel: 'Sections',
		guidesIntro: 'Practical answers to the problems VRChat world creators actually run into.',
		addToVcc: 'Add to VRChat Creator Companion',
		orPasteUrl: 'Or paste this URL into VCC, under Settings then Packages then Add Repository:',
		packageId: 'Package ID',
		shop: 'Shop',
		shopChoose: 'Choose your store',
		madeBy: 'Made by',
		joinDiscord: 'Discord',
		studioSite: 'Studio website',
		free: 'Free',
		paid: 'Paid',
		freePacks: 'Free packs',
		paidPacks: 'Paid packs',
		version: 'Version',
		requiresCore: 'Core',
		requires: 'Also requires',
		andAbove: 'and above',
		docs: 'Documentation',
		getIt: 'Get it',
		download: 'Download',
		pack: 'Pack',
		edition: 'Edition',
		minCore: 'Minimum Core',
		dependencies: 'Dependencies',
		none: 'None',
	},
	fr: {
		navDownload: 'Téléchargement',
		navPacks: 'Packs',
		navGuides: 'Guides',
		navFaq: 'FAQ',
		navLabel: 'Sections',
		guidesIntro: 'Des réponses concrètes aux problèmes que rencontrent vraiment les créateurs de mondes VRChat.',
		addToVcc: 'Ajouter au VRChat Creator Companion',
		orPasteUrl: 'Ou collez cette URL dans le VCC, sous Settings puis Packages puis Add Repository :',
		packageId: 'Identifiant du paquet',
		shop: 'Boutique',
		shopChoose: 'Choisissez votre boutique',
		madeBy: 'Réalisé par',
		joinDiscord: 'Discord',
		studioSite: 'Site du studio',
		free: 'Gratuit',
		paid: 'Payant',
		freePacks: 'Packs gratuits',
		paidPacks: 'Packs payants',
		version: 'Version',
		requiresCore: 'Core',
		requires: 'Nécessite aussi',
		andAbove: 'ou plus',
		docs: 'Documentation',
		getIt: 'Obtenir',
		download: 'Télécharger',
		pack: 'Pack',
		edition: 'Édition',
		minCore: 'Core minimum',
		dependencies: 'Dépendances',
		none: 'Aucune',
	},
	es: {
		navDownload: 'Descargas',
		navPacks: 'Packs',
		navGuides: 'Guías',
		navFaq: 'FAQ',
		navLabel: 'Secciones',
		guidesIntro: 'Respuestas prácticas a los problemas que de verdad encuentran quienes crean mundos de VRChat.',
		addToVcc: 'Añadir al VRChat Creator Companion',
		orPasteUrl: 'O pega esta URL en el VCC, en Settings, Packages y Add Repository:',
		packageId: 'ID del paquete',
		shop: 'Tienda',
		shopChoose: 'Elige tu tienda',
		madeBy: 'Creado por',
		joinDiscord: 'Discord',
		studioSite: 'Web del estudio',
		free: 'Gratis',
		paid: 'De pago',
		freePacks: 'Packs gratuitos',
		paidPacks: 'Packs de pago',
		version: 'Versión',
		requiresCore: 'Core',
		requires: 'También requiere',
		andAbove: 'o superior',
		docs: 'Documentación',
		getIt: 'Conseguir',
		download: 'Descargar',
		pack: 'Pack',
		edition: 'Edición',
		minCore: 'Core mínimo',
		dependencies: 'Dependencias',
		none: 'Ninguna',
	},
	de: {
		navDownload: 'Download',
		navPacks: 'Packs',
		navGuides: 'Anleitungen',
		navFaq: 'FAQ',
		navLabel: 'Bereiche',
		guidesIntro: 'Praktische Antworten auf die Probleme, die beim Bauen von VRChat-Welten wirklich auftreten.',
		addToVcc: 'Zum VRChat Creator Companion hinzufügen',
		orPasteUrl: 'Oder füge diese URL im VCC unter Settings, Packages, Add Repository ein:',
		packageId: 'Paket-ID',
		shop: 'Shop',
		shopChoose: 'Wähle deinen Shop',
		madeBy: 'Erstellt von',
		joinDiscord: 'Discord',
		studioSite: 'Studio-Website',
		free: 'Kostenlos',
		paid: 'Kostenpflichtig',
		freePacks: 'Kostenlose Packs',
		paidPacks: 'Kostenpflichtige Packs',
		version: 'Version',
		requiresCore: 'Core',
		requires: 'Benötigt außerdem',
		andAbove: 'oder neuer',
		docs: 'Dokumentation',
		getIt: 'Holen',
		download: 'Herunterladen',
		pack: 'Pack',
		edition: 'Edition',
		minCore: 'Mindest-Core',
		dependencies: 'Abhängigkeiten',
		none: 'Keine',
	},
};
