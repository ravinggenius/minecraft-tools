import classNames from "classnames";

import Anchor from "@/components/Anchor/Anchor";

import styles from "./SiteMasthead.module.scss";

export default function SiteMasthead({
	className,
	tagline,
	title
}: {
	className?: string;
	tagline: string;
	title: string;
}) {
	return (
		<header className={classNames(styles["site-masthead"], className)}>
			<span className={styles.title}>
				<Anchor className={styles.anchor} href="/" variant="inline">
					{title}
				</Anchor>
			</span>

			<span className={styles.tagline}>{tagline}</span>
		</header>
	);
}
