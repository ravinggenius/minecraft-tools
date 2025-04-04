"use client";

import classNames from "classnames";
import {
	ChangeEventHandler,
	ComponentProps,
	InputHTMLAttributes,
	useId,
	useState
} from "react";

import Field, { FieldMeta } from "@/components/Field/Field";
import { useForm } from "@/components/Form/Form";

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

export const useCheckboxField = (
	{ fieldFeedback }: Pick<ReturnType<typeof useForm>, "fieldFeedback">,
	name: ComponentProps<typeof CheckboxField>["name"],
	initialChecked: ComponentProps<typeof CheckboxField>["checked"] = undefined
) => {
	const id = useId();

	const [checked, setChecked] = useState(initialChecked);

	const [dirty, setDirty] = useState(false);
	const [focus, setFocus] = useState(false);

	const handleChange: ChangeEventHandler<HTMLInputElement> = ({
		target: { checked }
	}) => {
		setDirty(true);

		setChecked(checked);
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
		checked
	};
};
