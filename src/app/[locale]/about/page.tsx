import { Metadata } from "next";

import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata = async ({ params }: PageProps) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-about", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({ params, searchParams }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-about", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.description}>
			<p className={styles.content}>{t("description")}</p>
		</article>
	);
}
