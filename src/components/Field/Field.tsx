import classNames from "classnames";
import { ReactNode } from "react";

import Debug from "@/components/Debug/Debug";
import ExampleList, { Example } from "@/components/ExampleList/ExampleList";
import FeedbackList, { Feedback } from "@/components/FeedbackList/FeedbackList";
import { useTranslation } from "@/i18n/client";

import styles from "./Field.module.css";

export interface FieldMeta {
	dirty: boolean;
	focus: boolean;
}

export default function Field({
	children,
	className,
	debug = false,
	description,
	examples = [],
	feedback = [],
	id,
	label,
	meta,
	name,
	required = false
}: {
	children: ReactNode;
	className?: string;
	debug?: boolean;
	description?: string;
	examples?: Array<Example>;
	feedback?: Array<Feedback>;
	id: string;
	label: string;
	meta: FieldMeta;
	name: string;
	required?: boolean;
}) {
	const { t } = useTranslation("component-field");

	return (
		<div className={classNames(styles.layout, className)}>
			<label className={styles.label} htmlFor={id}>
				<span className={styles["label-text"]}>{label}</span>

				<span className={styles["label-indicator"]}>
					{t("requirement-indicator", {
						context: required ? "required" : "optional"
					})}
				</span>
			</label>

			<div className={styles.control}>{children}</div>

			<FeedbackList {...{ feedback }} />

			{description ? (
				<p className={styles.description}>{description}</p>
			) : null}

			<ExampleList {...{ examples }} />

			{debug ? (
				<Debug
					value={{
						name,
						required,
						meta,
						description,
						examples,
						feedback
					}}
				/>
			) : null}
		</div>
	);
}
