import { ReactNode } from "react";

import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

import styles from "./layout.module.scss";

export default async function DesignSystemLayout({
	children,
	params: { locale }
}: {
	children: ReactNode;
	params: { locale: SupportedLocale };
}) {
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
