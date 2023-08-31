import classNames from "classnames";

import styles from "./ExampleList.module.css";

export interface Example {
	description: string;
	sample: string;
}

export default function ExampleList({
	className,
	examples
}: {
	className?: string;
	examples: Array<Example>;
}) {
	return examples.length ? (
		<dl className={classNames(styles.list, className)}>
			{examples.map(({ description, sample }) => (
				<div className={styles.wrapper} key={sample}>
					<dt className={styles.sample}>
						<code>{sample}</code>
					</dt>

					<dd className={styles.description}>{description}</dd>
				</div>
			))}
		</dl>
	) : null;
}
