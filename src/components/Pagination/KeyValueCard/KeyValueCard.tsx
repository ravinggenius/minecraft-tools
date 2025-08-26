import classNames from "classnames";
import { ComponentProps } from "react";

import Badge from "@/components/Badge/Badge";
import Card from "@/components/Card/Card";

import styles from "./KeyValueCard.module.scss";

type Link = { href: string; text: string; isExternal: boolean };

type Range = { min: number; max: number };

interface KeyValuePair {
	key: string;
	value: string | Array<string> | Link | Range;
	isHighlighted?: boolean;
	isLarge?: boolean;
}

const isLink = (value: KeyValuePair["value"]) =>
	typeof value === "object" &&
	"href" in value &&
	"text" in value &&
	"isExternal" in value;

const isRange = (value: KeyValuePair["value"]) =>
	typeof value === "object" && "min" in value && "max" in value;

function ValueDisplay({ value }: { value: KeyValuePair["value"] }) {
	if (Array.isArray(value)) {
		return value.map((v, index) => <Badge key={index}>{v}</Badge>);
	} else if (isLink(value)) {
		return <a href={value.href}>{value.text}</a>;
	} else if (isRange(value)) {
		return `${value.min} - ${value.max}`;
	} else {
		return value;
	}
}

export default function KeyValueCard({
	className,
	pairs,
	...cardProps
}: Pick<
	ComponentProps<typeof Card>,
	"edition" | "href" | "locale" | "title" | "variant"
> & {
	className?: string;
	pairs: Array<KeyValuePair | null | undefined>;
}) {
	return (
		<Card {...cardProps} className={classNames(styles.root, className)}>
			{pairs.length ? (
				<dl className={styles.list}>
					{pairs.filter(Boolean).map((pair) => (
						<div
							className={styles.pair}
							data-highlight={pair.isHighlighted}
							data-size={pair.isLarge ? "large" : undefined}
							key={pair.key}
						>
							<dt className={styles.key}>{pair.key}</dt>

							<dd
								className={styles.value}
								data-multiple={
									Array.isArray(pair.value) || undefined
								}
							>
								<ValueDisplay value={pair.value} />
							</dd>
						</div>
					))}
				</dl>
			) : null}
		</Card>
	);
}
