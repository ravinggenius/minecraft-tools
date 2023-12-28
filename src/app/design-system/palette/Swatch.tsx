"use client";

import classNames from "classnames";

import { Hue, Lightness } from "./schema";
import styles from "./Swatch.module.scss";

export default function Swatch({
	className,
	hue,
	lightness
}: {
	className?: string;
	hue: Hue;
	lightness: Lightness;
}) {
	const color = `--color-${hue}-${lightness.toString().padStart(3, "0")}`;

	return (
		<figure className={classNames(styles.figure, className)} tabIndex={0}>
			<div
				className={styles.swatch}
				onClick={() => {
					navigator.clipboard.writeText(`var(${color})`);
				}}
				style={{
					backgroundColor: `var(${color})`
				}}
			/>

			<figcaption className={styles.caption}>{lightness}</figcaption>
		</figure>
	);
}
