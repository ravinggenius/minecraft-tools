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

	return (
		<article className={styles.article}>
			<p>{t("description")}</p>

			<header>
				<h1>{t("title")}</h1>
			</header>

			{HUES.map((hue) => (
				<section key={hue}>
					<header>
						<h2>{t(`${hue}.title`)}</h2>
					</header>

					<p>{t(`${hue}.description`)}</p>

					<SwatchList {...{ hue }} />
				</section>
			))}
		</article>
	);
}
