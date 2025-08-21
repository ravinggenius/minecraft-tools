import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import styles from "./page.module.scss";
import Sample from "./Sample";
import { NAMES } from "./schema";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/design-system/typography">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-typography",
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
}: PageProps<"/[locale]/design-system/typography">) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "design-system" },
		{ name: "typography" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-typography",
		{
			keyPrefix: "content"
		}
	);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<section className={styles.examples}>
				{NAMES.map((name) => (
					<section key={name}>
						<p className={styles[name]}>{name}</p>

						<Sample {...{ name }}>{t("copy-cta")}</Sample>

						<p className={styles.description}>
							{t(`examples.${name}.description`)}
						</p>
					</section>
				))}
			</section>
		</>
	);
}
