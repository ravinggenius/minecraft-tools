import classNames from "classnames";
import { ComponentProps } from "react";

import Field from "@/components/Field/Field";
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
	Pick<
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
			className={classNames(styles.field, className)}
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
