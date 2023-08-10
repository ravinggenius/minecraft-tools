import classNames from "classnames";

import Anchor from "@/components/Anchor/Anchor";
import { SOURCE_URL } from "@/library/_/constants";

import styles from "./SiteStern.module.css";

export default function SiteStern({ className }: { className?: string }) {
	return (
		<footer className={classNames(styles["site-stern"], className)}>
			<small className={styles.disclaimer}>
				Not an official Minecraft product. Not endorsed by or associated
				with Mojang or Microsoft.
			</small>

			<Anchor
				className={styles["source-link"]}
				href={SOURCE_URL}
				variant="inline"
			>
				view project source code
			</Anchor>
		</footer>
	);
}
