"use client";

import classNames from "classnames";
import {
	ChangeEventHandler,
	ComponentProps,
	FocusEventHandler,
	InputHTMLAttributes,
	useId,
	useState
} from "react";

import Field, { FieldMeta } from "@/components/Field/Field";
import { useForm } from "@/components/Form/Form";

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
	InputHTMLAttributes<HTMLInputElement>) {
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
			className={classNames(styles["text-field"], className)}
		>
			<input
				{...inputProps}
				{...{ id, name, required }}
				className={styles.input}
			/>
		</Field>
	);
}

export const useTextField = (
	{ fieldFeedback }: Pick<ReturnType<typeof useForm>, "fieldFeedback">,
	name: string,
	initialValue: string = ""
) => {
	const id = useId();

	const [value, setValue] = useState(initialValue);

	const [isFocused, setIsFocused] = useState(false);
	const [isPristine, setIsPristine] = useState(false);
	const [isTouched, setIsTouched] = useState(false);

	const handleChange: ChangeEventHandler<HTMLInputElement> = ({
		target: { value: newValue }
	}) => {
		setIsPristine(true);
		setIsTouched(true);

		setValue(newValue);
	};

	const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
		setIsFocused(true);
	};

	const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
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
		value
	};
};
