import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.scss";
import { HUES } from "./schema";
import SwatchList from "./SwatchList";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-design-system-palette", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function DesignSystemPalettePage() {
	const { t } = await loadPageTranslations("page-design-system-palette", {
		keyPrefix: "content"
	});

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
