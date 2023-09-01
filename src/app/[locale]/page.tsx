import { CommonPageProps } from "@/app/common-page-props";
import { loadPageTranslations } from "@/app/i18n/server";

import styles from "./page.module.css";

export default async function HomePage({
	params: { locale }
}: CommonPageProps) {
	const { t } = await loadPageTranslations(locale, "page-home", {
		keyPrefix: "content"
	});

	return (
		<div className={styles.description}>
			<p>{t("intro")}</p>

			<p>{t("explore")}</p>
		</div>
	);
}
