import classNames from "classnames";
import { ComponentProps, useId, useState } from "react";

import Field, { FieldMeta } from "@/components/Field/Field";
import { useForm } from "@/components/Form/Form";
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
		| "onChange"
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
				{...{ name, onChange, options, serialize, value }}
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

export const useSelectField = <TOption extends Option>(
	{ fieldFeedback }: Pick<ReturnType<typeof useForm>, "fieldFeedback">,
	name: string,
	options: Array<TOption>,
	initialValue?: TOption
) => {
	const id = useId();

	const [value, setValue] = useState(initialValue);

	const [dirty, setDirty] = useState(false);
	const [focus, setFocus] = useState(false);

	const handleChange: ComponentProps<
		typeof ObjectSelect<TOption>
	>["onChange"] = (newValue) => {
		setDirty(true);

		setValue(newValue);
	};

	const handleFocus = () => {
		setFocus(true);
	};

	const handleBlur = () => {
		setFocus(false);
	};

	return {
		feedback: fieldFeedback[name],
		id,
		meta: {
			dirty,
			focus
		} satisfies FieldMeta as FieldMeta,
		name,
		onChange: handleChange,
		onFocus: handleFocus,
		onBlur: handleBlur,
		options,
		value
	};
};
