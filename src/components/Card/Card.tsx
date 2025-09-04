import classNames from "classnames";
import Link, { LinkProps } from "next/link";
import { ComponentProps, ReactNode } from "react";

import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

import styles from "./Card.module.scss";

export default async function Card<HREF>({
	children,
	className,
	edition,
	href,
	locale,
	title,
	variant
}: {
	children: ReactNode;
	className?: string;
	edition?: "bedrock" | "java";
	href?: LinkProps<HREF>["href"];
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
					<h3 className={styles.title}>
						{href ? <Link {...{ href }}>{title}</Link> : title}
					</h3>
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

export type CardProps<HREF> = ComponentProps<typeof Card<HREF>>;
export type CardHref<HREF> = CardProps<HREF>["href"];
