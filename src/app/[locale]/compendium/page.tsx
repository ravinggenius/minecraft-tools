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
}: PageProps<"/[locale]/compendium">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-compendium", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/compendium">) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "compendium" }
	]);

	const { t } = await loadPageTranslations(locale, "page-compendium", {
		keyPrefix: "content"
	});

	const entries: Array<TableOfContentsEntry> = [
		{
			href: `/${locale}/compendium/releases` as TableOfContentsEntry["href"],
			text: t("table-of-contents.releases")
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
