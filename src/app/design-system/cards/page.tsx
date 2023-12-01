import Card from "@/components/Card/Card";
import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.scss";

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
		<section className={styles.examples}>
			<Card className={styles.example} variant="flat">
				<pre>{'variant="flat"'}</pre>
			</Card>

			<Card className={styles.example} variant="low">
				<pre>{'variant="low"'}</pre>
			</Card>

			<Card className={styles.example} variant="high">
				<pre>{'variant="high"'}</pre>
			</Card>
		</section>
	);
}
