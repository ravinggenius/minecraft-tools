import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";

export default async function HomePage({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

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
