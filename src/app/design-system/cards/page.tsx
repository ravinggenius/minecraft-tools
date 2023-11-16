import Card from "@/components/Card/Card";
import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-design-system-cards", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function DesignSystemCardsPage() {
	const { t } = await loadPageTranslations("page-design-system-cards", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.article}>
			<p>{t("description")}</p>

			<header>
				<h1>{t("title")}</h1>
			</header>

			<section className={styles.examples}>
				<Card className={styles.example} variant="high">
					<pre>high</pre>
				</Card>

				<Card className={styles.example} variant="low">
					<pre>low</pre>
				</Card>
			</section>
		</article>
	);
}
