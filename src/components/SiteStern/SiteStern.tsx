import classNames from "classnames";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { SOURCE_URL } from "@/library/_/constants";

import styles from "./SiteStern.module.css";

export default async function SiteStern({ className }: { className?: string }) {
	const { t } = await loadPageTranslations("component-site-stern");

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
