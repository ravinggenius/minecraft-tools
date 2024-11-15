import classNames from "classnames";

import styles from "./Badge.module.scss";

export default function Badge({
	children,
	className
}: {
	children: string;
	className?: string;
}) {
	return (
		<span className={classNames(styles.root, className)}>{children}</span>
	);
}
