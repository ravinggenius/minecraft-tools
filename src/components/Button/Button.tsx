import classNames from "classnames";
import { ButtonHTMLAttributes, ReactElement } from "react";

import { Interactive } from "@/components/_/interactive/interactive";

import styles from "./Button.module.scss";

export default function Button({
	children,
	className,
	type = "button",
	variant,
	...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> &
	Interactive & {
		children: string | ReactElement;
		className?: string;
	}) {
	return (
		<button
			{...buttonProps}
			{...{ type }}
			className={classNames(styles.button, className)}
			data-variant={variant}
		>
			{children}
		</button>
	);
}
