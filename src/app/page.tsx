import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.css";

export default async function HomePage() {
	const { t } = await loadPageTranslations("page-home", {
		keyPrefix: "content"
	});

	return (
		<div className={styles.description}>
			<p>{t("intro")}</p>

			<p>{t("explore")}</p>
		</div>
	);
}
