import classNames from "classnames";
import { ReactNode } from "react";

import styles from "./Card.module.scss";

export default function Card({
	children,
	className,
	variant
}: {
	children: ReactNode;
	className?: string;
	variant: "flat" | "low" | "high";
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
