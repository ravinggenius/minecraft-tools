"use client";

import classNames from "classnames";
import { ComponentProps, InputHTMLAttributes } from "react";

import Field, { FieldMeta } from "@/components/Field/Field";

import styles from "./CheckboxField.module.scss";

export default function CheckboxField({
	checked,
	className,
	debug = false,
	description,
	examples = [],
	feedback = [],
	id,
	label,
	meta,
	name,
	required = false,
	...inputProps
}: Pick<
	ComponentProps<typeof Field>,
	| "className"
	| "description"
	| "examples"
	| "feedback"
	| "id"
	| "label"
	| "required"
> & {
	debug?: boolean;
	meta: FieldMeta;
	name: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value">) {
	return (
		<Field
			{...{
				description,
				examples,
				feedback,
				id,
				label,
				meta,
				name,
				required
			}}
			className={classNames(styles["checkbox-field"], className)}
			debugValue={
				debug
					? {
							id,
							name,
							required,
							checked: checked ?? "<undefined>",
							description,
							examples,
							feedback,
							meta
						}
					: undefined
			}
		>
			<input
				{...inputProps}
				{...{ checked, id, name, required }}
				className={styles.input}
				type="checkbox"
				value="true"
			/>
		</Field>
	);
}
