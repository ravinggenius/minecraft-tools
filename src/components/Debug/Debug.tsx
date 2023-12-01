import classNames from "classnames";

import Pre from "../Pre/Pre";

import styles from "./Debug.module.scss";

export default function Debug({
	className,
	value
}: {
	className?: string;
	value: unknown;
}) {
	return (
		<Pre className={classNames(styles.debug, className)}>
			{JSON.stringify(value, null, 2)}
		</Pre>
	);
}
