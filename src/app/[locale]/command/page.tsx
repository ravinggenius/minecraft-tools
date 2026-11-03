import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import TableOfContents, {
	TableOfContentsEntry
} from "@/components/TableOfContents/TableOfContents";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-command", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({ params }: PageProps<"/[locale]/command">) {
	const { locale } = await ensureParams(PARAMS, params);

	await enforceAuthorization(["read", "any", "compendium"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" }
	]);

	const { t } = await loadPageTranslations(locale, "page-command", {
		keyPrefix: "content"
	});

	const entries: Array<TableOfContentsEntry> = [
		{
			href: `/${locale}/command/item-identities` as TableOfContentsEntry["href"],
			text: t("table-of-contents.item-identities")
		},
		{
			href: `/${locale}/command/items` as TableOfContentsEntry["href"],
			text: t("table-of-contents.items")
		},
		{
			href: `/${locale}/command/item-releases` as TableOfContentsEntry["href"],
			text: t("table-of-contents.item-releases")
		},
		{
			href: `/${locale}/command/item-colors` as TableOfContentsEntry["href"],
			text: t("table-of-contents.item-colors")
		},
		{
			href: `/${locale}/command/item-rarities` as TableOfContentsEntry["href"],
			text: t("table-of-contents.item-rarities")
		},
		{
			href: `/${locale}/command/item-stack-sizes` as TableOfContentsEntry["href"],
			text: t("table-of-contents.item-stack-sizes")
		},
		{
			href: `/${locale}/command/item-translation-keys` as TableOfContentsEntry["href"],
			text: t("table-of-contents.item-translation-keys")
		},
		{
			href: `/${locale}/command/platforms` as TableOfContentsEntry["href"],
			text: t("table-of-contents.platforms")
		},
		{
			href: `/${locale}/command/releases` as TableOfContentsEntry["href"],
			text: t("table-of-contents.releases")
		},
		{
			href: `/${locale}/command/release-cycles` as TableOfContentsEntry["href"],
			text: t("table-of-contents.release-cycles")
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
