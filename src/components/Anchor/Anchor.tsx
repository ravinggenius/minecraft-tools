import classNames from "classnames";
import Link, { LinkProps } from "next/link";
import { ComponentProps } from "react";

import { Interactive } from "@/components/_/interactive/interactive";

import styles from "./Anchor.module.scss";

export default function Anchor<HREF>({
	children,
	className,
	variant,
	...linkProps
}: LinkProps<HREF> &
	Interactive & {
		children: string;
		className?: string;
	}) {
	return (
		<Link
			{...linkProps}
			className={classNames(styles.anchor, className)}
			data-variant={variant}
		>
			{children}
		</Link>
	);
}

export type AnchorProps<HREF> = ComponentProps<typeof Anchor<HREF>>;
export type AnchorHref<HREF> = AnchorProps<HREF>["href"];
