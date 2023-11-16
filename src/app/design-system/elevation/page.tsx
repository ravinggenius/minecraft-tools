import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.scss";
import { BORDER_STYLES, SHADOW_STYLES } from "./schema";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-design-system-elevation", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function DesignSystemElevationPage() {
	const { t } = await loadPageTranslations("page-design-system-elevation", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.article}>
			<p>{t("description")}</p>

			<header>
				<h1>{t("title")}</h1>
			</header>

			{BORDER_STYLES.map((borderStyle) => (
				<section key={borderStyle}>
					<header>
						<h2>{t(`border.${borderStyle}.title`)}</h2>
					</header>

					<div style={{ border: `var(--border-${borderStyle})` }}>
						<p>{`--border-${borderStyle}`}</p>
					</div>
				</section>
			))}

			{SHADOW_STYLES.map((shadowStyle) => (
				<section key={shadowStyle}>
					<header>
						<h2>{t(`shadow.${shadowStyle}.title`)}</h2>
					</header>

					<div style={{ boxShadow: `var(--shadow-${shadowStyle})` }}>
						<p>{`--shadow-${shadowStyle}`}</p>
					</div>
				</section>
			))}
		</article>
	);
}
