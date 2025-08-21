import { Metadata } from "next";

import Anchor, { AnchorProps, InternalHref } from "@/components/Anchor/Anchor";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
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

	const designElements: Array<{
		href: InternalHref;
		text: AnchorProps["children"];
	}> = [
		{
			href: `/${locale}/design-system/palette` as InternalHref,
			text: t("table-of-contents.palette")
		},
		{
			href: `/${locale}/design-system/elevation` as InternalHref,
			text: t("table-of-contents.elevation")
		},
		{
			href: `/${locale}/design-system/typography` as InternalHref,
			text: t("table-of-contents.typography")
		},
		{
			href: `/${locale}/design-system/cards` as InternalHref,
			text: t("table-of-contents.cards")
		},
		{
			href: `/${locale}/design-system/interactive` as InternalHref,
			text: t("table-of-contents.interactive")
		},
		{
			href: `/${locale}/design-system/input` as InternalHref,
			text: t("table-of-contents.input")
		},
		{
			href: `/${locale}/design-system/table` as InternalHref,
			text: t("table-of-contents.table")
		}
	];

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<nav className={styles.root}>
				<ol className={styles.list}>
					{designElements.map(({ href, text }) => (
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
