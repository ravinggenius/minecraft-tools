import { InternalHref } from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

export interface Crumb {
	href: InternalHref;
	label: string;
	name: string;
	value: string;
}

type CrumbAttrsFull = Pick<Crumb, "label" | "name" | "value">;

type CrumbAttrsAutoLabel = Pick<Crumb, "name" | "value">;

type CrumbAttrsAutoLabelValue = Pick<Crumb, "name">;

export type CrumbAttrs =
	| CrumbAttrsFull
	| CrumbAttrsAutoLabel
	| CrumbAttrsAutoLabelValue;

const hasLabel = (attrs: CrumbAttrs): attrs is CrumbAttrsFull =>
	Boolean((attrs as CrumbAttrsFull).label);

const hasValue = (
	attrs: CrumbAttrs
): attrs is CrumbAttrsFull | CrumbAttrsAutoLabel =>
	Boolean((attrs as CrumbAttrsFull | CrumbAttrsAutoLabel).value);

export interface NestedCrumb extends Crumb {
	child: Crumb | NestedCrumb;
}

export const buildBreadcrumbs = async (
	locale: SupportedLocale,
	crumbAttrs: Array<CrumbAttrs>
) => {
	const { t } = await loadPageTranslations(
		locale,
		"component-breadcrumb-trail"
	);

	const fullAttrs = crumbAttrs.map((attrs) => {
		if (!hasLabel(attrs) && !hasValue(attrs)) {
			return {
				...attrs,
				label: t(`segment-labels.${attrs.name}`),
				value: attrs.name
			};
		} else if (!hasLabel(attrs)) {
			return {
				...attrs,
				label: t(`segment-labels.${attrs.name}`)
			};
		} else {
			return attrs;
		}
	});

	const values = fullAttrs.map(({ value }) => value);

	return fullAttrs.map(
		(attrs, index) =>
			({
				...attrs,
				href: `/${values.slice(0, index + 1).join("/")}` as Crumb["href"]
			}) satisfies Crumb as Crumb
	);
};

export const buildBreadcrumbsWithPrefix = (
	locale: SupportedLocale,
	crumbAttrs: Array<CrumbAttrs>
) =>
	buildBreadcrumbs(locale, [
		{ name: "locale", value: locale },
		...crumbAttrs
	]);
