import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageGenerateMetadata,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-compendium", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-compendium", {
		keyPrefix: "content"
	});

	type InternalLink = ComponentProps<typeof Anchor>["href"];

	const compendiumEntries: Array<{
		href: ComponentProps<typeof Anchor>["href"];
		text: ComponentProps<typeof Anchor>["children"];
	}> = [
		{
			href: `/${locale}/compendium/releases` as InternalLink,
			text: t("table-of-contents.releases")
		}
	];

	return (
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
	);
}
