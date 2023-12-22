"use client";

import classNames from "classnames";
import { cond, F, T } from "rambda";

import { Hue, Lightness } from "./schema";
import styles from "./Swatch.module.scss";

const isDark = cond<[{ h: Hue; l: Lightness }], boolean>([
	[({ h, l }) => h === "yellow" && l === 900, T],
	[({ h, l }) => h === "yellow", F],
	[({ l }) => l >= 450, T],
	[({ l }) => l < 450, F]
]);

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
	const colorIsDark = isDark({
		h: hue,
		l: lightness
	});
	const contrastColor = `--color-special-${colorIsDark ? "snow" : "coal"}`;

	return (
		<li
			className={classNames(styles.item, className)}
			key={lightness}
			onClick={() => {
				navigator.clipboard.writeText(`var(${color})`);
			}}
			style={{
				backgroundColor: `var(${color})`,
				color: `var(${contrastColor})`
			}}
			tabIndex={0}
		>{`${color}`}</li>
	);
}
