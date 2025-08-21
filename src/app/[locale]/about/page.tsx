import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/about">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-about", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({ params }: PageProps<"/[locale]/about">) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "about" }
	]);

	const { t } = await loadPageTranslations(locale, "page-about", {
		keyPrefix: "content"
	});

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.description}>
				<p className={styles.content}>{t("description")}</p>
			</article>
		</>
	);
}
