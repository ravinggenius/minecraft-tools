import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	LayoutProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./layout.module.scss";

export default async function Layout({ children, params }: LayoutProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "layout-design-system", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.article}>
			<header className={styles.header}>
				<h1 className={styles.title}>{t("title")}</h1>
			</header>

			<p className={styles.description}>{t("description")}</p>

			{children}
		</article>
	);
}
