import { Metadata } from "next";

import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.scss";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-about", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function AboutPage() {
	const { t } = await loadPageTranslations("page-about", {
		keyPrefix: "content"
	});

	return (
		<div className={styles.description}>
			<p>{t("description")}</p>
		</div>
	);
}
