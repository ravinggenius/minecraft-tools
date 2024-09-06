import classNames from "classnames";
import type { Route } from "next";
import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

import { Interactive } from "@/components/_/interactive/interactive";

import styles from "./Anchor.module.scss";

export default function Anchor<HREF extends string>({
	children,
	className,
	href,
	variant
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: Route<HREF>;
} & Interactive & {
		children: string;
		className?: string;
	}) {
	return (
		<Link
			className={classNames(styles.anchor, className)}
			data-variant={variant}
			href={href as Route<HREF>}
		>
			{children}
		</Link>
	);
}
