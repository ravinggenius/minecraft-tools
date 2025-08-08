import classNames from "classnames";
import { ComponentProps, FocusEventHandler, useId, useState } from "react";

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

export const useSelectField = <TOption extends Option>(
	{ fieldFeedback }: Pick<ReturnType<typeof useForm>, "fieldFeedback">,
	name: string,
	options: Array<TOption>,
	initialValue?: TOption
) => {
	const id = useId();

	const [value, setValue] = useState(initialValue);

	const [isFocused, setIsFocused] = useState(false);
	const [isPristine, setIsPristine] = useState(true);
	const [isTouched, setIsTouched] = useState(false);

	const handleChange: ComponentProps<
		typeof ObjectSelect<TOption>
	>["onChange"] = (newValue) => {
		setIsPristine(true);
		setIsTouched(true);

		setValue(newValue);
	};

	const handleFocus: FocusEventHandler<HTMLSelectElement> = () => {
		setIsFocused(true);
	};

	const handleBlur: FocusEventHandler<HTMLSelectElement> = () => {
		setIsFocused(false);
		setIsTouched(true);
	};

	return {
		feedback: fieldFeedback[name],
		id,
		meta: {
			isDirty: !isPristine,
			isFocused,
			isPristine,
			isTouched,
			isValid: true
		} satisfies FieldMeta as FieldMeta,
		name,
		onChange: handleChange,
		onFocus: handleFocus,
		onBlur: handleBlur,
		options,
		value
	};
};
