import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageGenerateMetadata,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";
import { HUES } from "./schema";
import SwatchList from "./SwatchList";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-palette",
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
		"page-design-system-palette",
		{
			keyPrefix: "content"
		}
	);

	return HUES.map((hue) => (
		<section key={hue}>
			<header className={styles.header}>
				<h2 className={styles.title}>{t(`${hue}.title`)}</h2>
			</header>

			<p className={styles.description}>{t(`${hue}.description`)}</p>

			<SwatchList {...{ hue }} />
		</section>
	));
}
