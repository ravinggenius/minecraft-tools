import classNames from "classnames";

import Anchor from "@/components/Anchor/Anchor";
import { SupportedLocale } from "@/i18n/settings";

import styles from "./SiteMasthead.module.scss";

export default function SiteMasthead({
	className,
	locale,
	tagline,
	title
}: {
	className?: string;
	locale: SupportedLocale;
	tagline: string;
	title: string;
}) {
	return (
		<header className={classNames(styles["site-masthead"], className)}>
			<span className={styles.title}>
				<Anchor
					className={styles.anchor}
					href={`/${locale}`}
					variant="inline"
				>
					{title}
				</Anchor>
			</span>

			<span className={styles.tagline}>{tagline}</span>
		</header>
	);
}
