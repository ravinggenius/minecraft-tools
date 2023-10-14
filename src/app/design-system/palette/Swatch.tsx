import classNames from "classnames";
import { always, cond } from "rambda";

import { Hue, Lightness } from "./schema";
import styles from "./Swatch.module.css";

const contrastColorLightness: (arg: { h: Hue; l: Lightness }) => 100 | 900 =
	cond([
		[({ h, l }) => h === "yellow" && l === 900, always(100)],
		[({ h, l }) => h === "yellow", always(900)],
		[({ l }) => l >= 450, always(100)],
		[({ l }) => l < 450, always(900)]
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
	const color = `--color-${hue}-${lightness}`;
	const contrastColor = `--color-neutral-${contrastColorLightness({
		h: hue,
		l: lightness
	})}`;

	return (
		<li
			className={classNames(styles.item, className)}
			key={lightness}
			style={{
				backgroundColor: `var(${color})`,
				color: `var(${contrastColor})`
			}}
		>{`${color}`}</li>
	);
}
