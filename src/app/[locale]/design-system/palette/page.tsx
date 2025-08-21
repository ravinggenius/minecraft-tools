import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import styles from "./page.module.scss";
import { HUES } from "./schema";
import SwatchList from "./SwatchList";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/design-system/palette">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-palette",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/design-system/palette">) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "design-system" },
		{ name: "palette" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-palette",
		{
			keyPrefix: "content"
		}
	);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			{HUES.map((hue) => (
				<section key={hue}>
					<header className={styles.header}>
						<h2 className={styles.title}>{t(`${hue}.title`)}</h2>
					</header>

					<p className={styles.description}>
						{t(`${hue}.description`)}
					</p>

					<SwatchList {...{ hue }} />
				</section>
			))}
		</>
	);
}
