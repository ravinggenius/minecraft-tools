import classNames from "classnames";
import type { Route } from "next";
import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

import { Interactive } from "@/components/_/interactive/interactive";

import styles from "./Anchor.module.css";

export default function Anchor<HREF extends string>({
	children,
	className,
	href,
	variant
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: Route<HREF> | URL;
} & Interactive & {
		children: string;
		className?: string;
	}) {
	return (
		<Link
			{...{ href }}
			className={classNames(styles.anchor, className)}
			data-variant={variant}
		>
			{children}
		</Link>
	);
}
