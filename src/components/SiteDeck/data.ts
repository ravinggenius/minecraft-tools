import { Resource } from "./schemas";

export const compendium: Resource = {
	title: "Compendium",
	href: ({ locale }) => `/${locale}/compendium`,
	children: [
		{
			title: "Trades",
			href: ({ locale }) => `/${locale}/compendium/trades`
		}
	]
};

export const legacy: Resource = {
	title: "Legacy",
	href: ({ locale }) => `/${locale}/legacy`,
	children: [
		{
			title: "Worlds",
			href: ({ locale }) => `/${locale}/legacy/worlds`
		}
	]
};

export const worlds: Resource = {
	title: "Worlds",
	href: ({ locale }) => `/${locale}/worlds`
};

export const about: Resource = {
	title: "About",
	href: ({ locale }) => `/${locale}/about`
};

export const ALL: Array<Resource> = [compendium, worlds, about, legacy];
