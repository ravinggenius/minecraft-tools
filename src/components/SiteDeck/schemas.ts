import { SupportedLocale } from "@/i18n/settings";

interface PathParams {
	locale: SupportedLocale;
}

interface ResourceWithChildren {
	children: Array<Resource>;
	href: (pathParams: PathParams) => string;
	title: string;
	description?: string;
}

interface ResourceWithoutChildren {
	children?: Array<never>;
	href: (pathParams: PathParams) => string;
	title: string;
	description?: string;
}

export type Resource = ResourceWithChildren | ResourceWithoutChildren;
