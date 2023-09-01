import { Metadata } from "next";
import { ComponentProps } from "react";

import { CommonPageProps } from "@/app/common-page-props";
import { loadPageTranslations } from "@/app/i18n/server";

import styles from "./page.module.css";

export const generateMetadata = async ({
	params: { locale }
}: ComponentProps<typeof AboutPage>) => {
	const { t } = await loadPageTranslations(locale, "page-about", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata;
};

export default async function AboutPage({
	params: { locale }
}: CommonPageProps) {
	const { t } = await loadPageTranslations(locale, "page-about", {
		keyPrefix: "content"
	});

	return (
		<div className={styles.description}>
			<p>{t("description")}</p>
		</div>
	);
}
