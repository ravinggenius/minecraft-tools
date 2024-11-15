import classNames from "classnames";
import { ReactNode } from "react";

import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

import styles from "./Card.module.scss";

export default async function Card({
	children,
	className,
	edition,
	locale,
	title,
	variant
}: {
	children: ReactNode;
	className?: string;
	edition?: "bedrock" | "java";
	locale: SupportedLocale;
	title?: string;
	variant: "flat" | "low" | "high";
}) {
	const { t } = await loadPageTranslations(locale, "component-card");

	return (
		<div
			className={classNames(styles.card, className)}
			data-variant={variant}
		>
			{title ? (
				<header className={styles.header}>
					<h3 className={styles.title}>{title}</h3>
				</header>
			) : null}

			{edition ? (
				<aside className={styles.edition} data-edition={edition}>
					{t("edition", { context: edition })}
				</aside>
			) : null}

			{children}
		</div>
	);
}
