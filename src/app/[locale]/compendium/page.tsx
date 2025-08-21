import { Metadata } from "next";

import Anchor, { AnchorProps, InternalHref } from "@/components/Anchor/Anchor";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
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

	const compendiumEntries: Array<{
		href: InternalHref;
		text: AnchorProps["children"];
	}> = [
		{
			href: `/${locale}/compendium/releases` as InternalHref,
			text: t("table-of-contents.releases")
		}
	];

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<nav className={styles.root}>
				<p>{t("description")}</p>

				<ol className={styles.list}>
					{compendiumEntries.map(({ href, text }) => (
						<li className={styles.item} key={href}>
							<Anchor {...{ href }} variant="inline">
								{text}
							</Anchor>
						</li>
					))}
				</ol>
			</nav>
		</>
	);
}
