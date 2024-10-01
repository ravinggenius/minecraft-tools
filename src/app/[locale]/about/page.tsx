import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageGenerateMetadata,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-about", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-about", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.description}>
			<p className={styles.content}>{t("description")}</p>
		</article>
	);
}
