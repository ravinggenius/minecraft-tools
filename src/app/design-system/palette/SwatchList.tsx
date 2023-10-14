import classNames from "classnames";

import { Hue, LIGHTNESSES } from "./schema";
import Swatch from "./Swatch";
import styles from "./SwatchList.module.css";

export default function SwatchList({
	className,
	hue
}: {
	className?: string;
	hue: Hue;
}) {
	return (
		<ol className={classNames(styles.list, className)}>
			{LIGHTNESSES.map((lightness) => {
				return (
					<Swatch
						{...{ hue, lightness }}
						className={styles.item}
						key={lightness}
					/>
				);
			})}
		</ol>
	);
}
