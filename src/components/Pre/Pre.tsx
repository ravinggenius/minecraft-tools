import classNames from "classnames";
import { ReactNode } from "react";

import styles from "./Pre.module.css";

export default function Pre({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
}) {
	return <pre className={classNames(styles.pre, className)}>{children}</pre>;
}
