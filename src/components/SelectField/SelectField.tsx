import classNames from "classnames";
import { ComponentProps } from "react";

import Field, { FieldMeta } from "@/components/Field/Field";
import ObjectSelect, { Option } from "@/components/ObjectSelect/ObjectSelect";

import styles from "./SelectField.module.scss";

export default function SelectField<TOption extends Option>({
	children,
	className,
	debug = false,
	description,
	examples = [],
	feedback,
	id,
	includeBlank = false,
	label,
	meta,
	name,
	onChange,
	onFocus,
	onBlur,
	options,
	required = false,
	serialize,
	value
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
} & Pick<
		ComponentProps<typeof ObjectSelect<TOption>>,
		| "children"
		| "includeBlank"
		| "name"
		| "onBlur"
		| "onChange"
		| "onFocus"
		| "options"
		| "serialize"
		| "value"
	>) {
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
			className={classNames(styles.field, className)}
			debugValue={
				debug
					? {
							id,
							name,
							includeBlank,
							required,
							value: value ?? "<undefined>",
							options,
							description,
							examples,
							feedback,
							meta
						}
					: undefined
			}
		>
			<ObjectSelect
				{...{
					name,
					onChange,
					onFocus,
					onBlur,
					options,
					serialize,
					value
				}}
				includeBlank={
					(includeBlank && !required) ||
					(includeBlank && required && !value)
				}
			>
				{children}
			</ObjectSelect>
		</Field>
	);
}
