import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

import styles from "./page.module.scss";
import Sample from "./Sample";
import { NAMES } from "./schema";

export const generateMetadata = async ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-typography",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	};
};

export default async function DesignSystemTypographyPage({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-typography",
		{
			keyPrefix: "content"
		}
	);

	return (
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
	);
}
