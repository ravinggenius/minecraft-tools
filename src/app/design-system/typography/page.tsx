import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.scss";
import Sample from "./Sample";
import { NAMES } from "./schema";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-design-system-typography", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function DesignSystemTypographyPage() {
	const { t } = await loadPageTranslations("page-design-system-typography", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.article}>
			<p>{t("description")}</p>

			<header>
				<h1>{t("title")}</h1>
			</header>

			<section className={styles.examples}>
				{NAMES.map((name) => (
					<section key={name}>
						<p className={styles[name]}>{name}</p>

						<Sample {...{ name }}>{t("copy-cta")}</Sample>

						<p className={styles.description}>
							{t(`examples.${name}.description`)}
						</p>
					</section>
				))}
			</section>
		</article>
	);
}
