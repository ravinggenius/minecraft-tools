import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageGenerateMetadata,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";
import Sample from "./Sample";
import { NAMES } from "./schema";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

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

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

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
