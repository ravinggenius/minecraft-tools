import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import TableOfContents, {
	TableOfContentsEntry
} from "@/components/TableOfContents/TableOfContents";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/design-system">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-design-system", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/design-system">) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "design-system" }
	]);

	const { t } = await loadPageTranslations(locale, "page-design-system", {
		keyPrefix: "content"
	});

	const entries: Array<TableOfContentsEntry> = [
		{
			href: `/${locale}/design-system/palette` as TableOfContentsEntry["href"],
			text: t("table-of-contents.palette")
		},
		{
			href: `/${locale}/design-system/elevation` as TableOfContentsEntry["href"],
			text: t("table-of-contents.elevation")
		},
		{
			href: `/${locale}/design-system/typography` as TableOfContentsEntry["href"],
			text: t("table-of-contents.typography")
		},
		{
			href: `/${locale}/design-system/cards` as TableOfContentsEntry["href"],
			text: t("table-of-contents.cards")
		},
		{
			href: `/${locale}/design-system/interactive` as TableOfContentsEntry["href"],
			text: t("table-of-contents.interactive")
		},
		{
			href: `/${locale}/design-system/input` as TableOfContentsEntry["href"],
			text: t("table-of-contents.input")
		},
		{
			href: `/${locale}/design-system/table` as TableOfContentsEntry["href"],
			text: t("table-of-contents.table")
		}
	];

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<TableOfContents
				{...{ entries }}
				className={styles["table-of-contents"]}
				description={t("description")}
			/>
		</>
	);
}
