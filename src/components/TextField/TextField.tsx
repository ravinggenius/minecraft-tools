"use client";

import classNames from "classnames";
import { ComponentProps, InputHTMLAttributes } from "react";

import Field, { FieldMeta } from "@/components/Field/Field";

import styles from "./TextField.module.scss";

export default function TextField({
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
	type = "text",
	value,
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
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value"> & {
		value: string;
	}) {
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
			className={classNames(styles["text-field"], className)}
			debugValue={
				debug
					? {
							id,
							name,
							required,
							value,
							type,
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
				{...{ id, name, required, type, value }}
				className={styles.input}
			/>
		</Field>
	);
}
