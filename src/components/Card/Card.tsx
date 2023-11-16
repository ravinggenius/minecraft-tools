import classNames from "classnames";
import { ReactNode } from "react";

import styles from "./Card.module.css";

export default function Card({
	children,
	className,
	variant
}: {
	children: ReactNode;
	className?: string;
	variant: "high" | "low";
}) {
	return (
		<div
			className={classNames(styles.card, className)}
			data-variant={variant}
		>
			{children}
		</div>
	);
}
