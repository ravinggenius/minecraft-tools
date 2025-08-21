import { loadPageTranslations } from "@/i18n/server";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import styles from "./layout.module.scss";

export default async function Layout({
	children,
	params
}: LayoutProps<"/[locale]/design-system">) {
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
