import classNames from "classnames";
import { AnchorHTMLAttributes } from "react";

import { Interactive } from "@/components/_/interactive/interactive";

import styles from "./Anchor.module.css";

export default function Anchor({
	children,
	className,
	href,
	variant
}: AnchorHTMLAttributes<HTMLAnchorElement> &
	Interactive & {
		children: string;
		className?: string;
	}) {
	return (
		<a
			{...{ href }}
			className={classNames(styles.anchor, className)}
			data-variant={variant}
		>
			{children}
		</a>
	);
}
