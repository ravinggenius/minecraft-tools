import Card from "@/components/Card/Card";
import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata = async ({ params }: PageProps) => {
	const { locale } = await ensureParams(PARAMS, params);
	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-cards",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);
	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-cards",
		{
			keyPrefix: "content"
		}
	);

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
