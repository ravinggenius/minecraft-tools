import { Metadata } from "next";

import { translation } from "@/i18n/server";

import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await translation("page-about", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata;
};

export default async function AboutPage() {
	const { t } = await translation("page-about", {
		keyPrefix: "content"
	});

	return (
		<div className={styles.description}>
			<p>{t("description")}</p>
		</div>
	);
}
