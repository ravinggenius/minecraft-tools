import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { PageGenerateMetadata, PageProps } from "@/library/route-meta.schema";

import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-design-system", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-design-system", {
		keyPrefix: "content"
	});

	type InternalLink = ComponentProps<typeof Anchor>["href"];

	const designElements: Array<{
		href: ComponentProps<typeof Anchor>["href"];
		text: ComponentProps<typeof Anchor>["children"];
	}> = [
		{
			href: `/${locale}/design-system/palette` as InternalLink,
			text: t("table-of-contents.palette")
		},
		{
			href: `/${locale}/design-system/elevation` as InternalLink,
			text: t("table-of-contents.elevation")
		},
		{
			href: `/${locale}/design-system/typography` as InternalLink,
			text: t("table-of-contents.typography")
		},
		{
			href: `/${locale}/design-system/cards` as InternalLink,
			text: t("table-of-contents.cards")
		},
		{
			href: `/${locale}/design-system/interactive` as InternalLink,
			text: t("table-of-contents.interactive")
		},
		{
			href: `/${locale}/design-system/input` as InternalLink,
			text: t("table-of-contents.input")
		},
		{
			href: `/${locale}/design-system/table` as InternalLink,
			text: t("table-of-contents.table")
		}
	];

	return (
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
	);
}
