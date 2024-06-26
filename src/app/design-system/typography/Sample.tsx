"use client";

import classNames from "classnames";

import Button from "@/components/Button/Button";

import styles from "./Sample.module.scss";
import { Name } from "./schema";

export default function Sample({
	children,
	className,
	name
}: {
	children: string;
	className?: string;
	name: Name;
}) {
	return (
		<Button
			className={classNames(styles.example, className)}
			onClick={() => {
				navigator.clipboard.writeText(`@include typography.${name}();`);
			}}
			variant="secondary"
		>
			{children}
		</Button>
	);
}
