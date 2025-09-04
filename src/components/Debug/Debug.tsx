import classNames from "classnames";

import Pre from "../Pre/Pre";

import styles from "./Debug.module.scss";

export default function Debug({
	className,
	label,
	value
}: {
	className?: string;
	label?: string;
	value: unknown;
}) {
	return (
		<Pre className={classNames(styles.debug, className)}>
			{label ? (
				<>
					<strong className={styles.label}>{label}</strong>
					{" = "}
				</>
			) : null}

			{JSON.stringify(value, null, 2)}
		</Pre>
	);
}
