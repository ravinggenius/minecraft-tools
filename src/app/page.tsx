import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.scss";

export default async function HomePage() {
	const { t } = await loadPageTranslations("page-home", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.description}>
			<p className={styles.introduction}>{t("intro")}</p>

			<p className={styles.explore}>{t("explore")}</p>
		</article>
	);
}
