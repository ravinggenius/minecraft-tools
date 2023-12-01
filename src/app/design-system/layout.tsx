import { ReactNode } from "react";

import { loadPageTranslations } from "@/i18n/server";

import styles from "./layout.module.scss";

export default async function DesignSystemLayout({
	children
}: {
	children: ReactNode;
}) {
	const { t } = await loadPageTranslations("layout-design-system", {
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
