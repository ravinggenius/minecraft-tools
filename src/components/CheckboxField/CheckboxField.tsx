"use client";

import classNames from "classnames";
import { ComponentProps, InputHTMLAttributes } from "react";

import Field from "@/components/Field/Field";

import styles from "./CheckboxField.module.scss";

export default function CheckboxField({
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
	| "debug"
	| "description"
	| "examples"
	| "feedback"
	| "id"
	| "label"
	| "meta"
	| "name"
	| "required"
> &
	Omit<InputHTMLAttributes<HTMLInputElement>, "value">) {
	return (
		<Field
			{...{
				debug,
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
		>
			<input
				{...inputProps}
				{...{ id, name, required }}
				className={styles.input}
				type="checkbox"
				value="true"
			/>
		</Field>
	);
}
