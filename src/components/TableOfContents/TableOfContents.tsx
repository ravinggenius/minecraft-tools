"use client";

import classNames from "classnames";
import { useState } from "react";

import Button from "@/components/Button/Button";
import NavigationTree from "@/components/NavigationTree/NavigationTree";

import { ALL as BASE_RESOURCES } from "./data";
import styles from "./TableOfContents.module.css";

export default function TableOfContents({ className }: { className?: string }) {
	const [show, setShow] = useState(false);

	return (
		<nav className={classNames(styles["table-of-contents"], className)}>
			<Button
				onClick={() => {
					setShow((prev) => !prev);
				}}
				type="button"
				variant="secondary"
			>
				{show ? "close table of contents" : "open table of contents"}
			</Button>

			<NavigationTree branches={BASE_RESOURCES} open={show} />
		</nav>
	);
}
