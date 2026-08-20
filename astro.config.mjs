// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://essentials.frenchoasis.studio',
	integrations: [
		starlight({
			title: 'FOS Essentials',
			description:
				'Unity tools for VRChat worlds — UdonSharp packs by French Oasis Studio.',
			// L'anglais est la langue pivot : il occupe la racine du site, les autres
			// langues vivent sous /fr, /es, /de. Une page non traduite retombe
			// automatiquement sur l'anglais, ce qui permet de publier au fil de l'eau.
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				fr: { label: 'Français', lang: 'fr' },
				es: { label: 'Español', lang: 'es' },
				de: { label: 'Deutsch', lang: 'de' },
			},
			logo: { src: './src/assets/logo.png', alt: 'FOS Essentials' },
			favicon: '/favicon.png',
			customCss: ['./src/styles/custom.css'],
			social: [
				{
					icon: 'discord',
					label: 'Discord',
					href: 'https://discord.gg/t33r3Wfj3n',
				},
				{
					icon: 'external',
					label: 'Shop',
					href: 'https://shop.frenchoasis.studio/en-eur/collections/vrchat-assets',
				},
			],
			editLink: {
				baseUrl:
					'https://github.com/FrankkDarko/fos-essentials-site/edit/main/',
			},
			sidebar: [
				{
					label: 'Start here',
					translations: {
						fr: 'Démarrer',
						es: 'Empezar',
						de: 'Loslegen',
					},
					items: [
						{ label: 'All packs', slug: 'catalog' },
						{ label: 'Installation', slug: 'start/installation' },
						{ label: 'Compatibility', slug: 'start/compatibility' },
					],
				},
				{
					label: 'Packs',
					items: [{ autogenerate: { directory: 'packs' } }],
				},
				{
					label: 'Changelogs',
					collapsed: true,
					items: [{ autogenerate: { directory: 'changelogs' } }],
				},
			],
		}),
	],
});
