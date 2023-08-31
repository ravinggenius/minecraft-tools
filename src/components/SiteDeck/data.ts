import { Resource } from "./schemas";

export const compendium: Resource = {
	title: "Compendium",
	href: "/compendium",
	children: [
		{
			title: "Trades",
			href: "/compendium/trades"
		}
	]
};

export const legacy: Resource = {
	title: "Legacy",
	href: "/legacy",
	children: [
		{
			title: "Worlds",
			href: "/legacy/worlds"
		}
	]
};

export const worlds: Resource = {
	title: "Worlds",
	href: "/worlds"
};

export const about: Resource = {
	title: "About",
	href: "/about"
};

export const ALL: Array<Resource> = [compendium, worlds, about, legacy];
