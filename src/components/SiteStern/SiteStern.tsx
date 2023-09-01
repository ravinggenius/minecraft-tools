import classNames from "classnames";

import { loadPageTranslations } from "@/app/i18n/server";
import { SupportedLocale } from "@/app/i18n/settings";
import Anchor from "@/components/Anchor/Anchor";
import { SOURCE_URL } from "@/library/_/constants";

import styles from "./SiteStern.module.css";

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
