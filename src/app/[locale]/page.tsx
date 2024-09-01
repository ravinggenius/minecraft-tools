import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

import styles from "./page.module.scss";

export default async function HomePage({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) {
	const { t } = await loadPageTranslations(locale, "page-home", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.description}>
			<p className={styles.introduction}>{t("intro")}</p>

			<p className={styles.explore}>{t("explore")}</p>
		</article>
	);
}
