import classNames from "classnames";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { SOURCE_URL } from "@/library/constants";

import styles from "./SiteStern.module.scss";

export default async function SiteStern({
	className,
	locale
}: {
	className?: string;
	locale: SupportedLocale;
}) {
	const { t } = await loadPageTranslations(locale, "component-site-stern");

	return (
		<footer className={classNames(styles["site-stern"], className)}>
			<small className={styles.disclaimer}>{t("disclaimer")}</small>

			<Anchor
				className={styles["source-link"]}
				href={SOURCE_URL}
				variant="inline"
			>
				{t("project-source-cta")}
			</Anchor>
		</footer>
	);
}
