"use client";

import classNames from "classnames";
import {
	ChangeEventHandler,
	ComponentProps,
	SelectHTMLAttributes,
	useId,
	useState
} from "react";

import Field, { FieldMeta } from "@/components/Field/Field";
import { useForm } from "@/components/Form/Form";
import { Identity } from "@/services/datastore-service/schema";

import styles from "./SelectField.module.scss";

export default function SelectField<TOption extends Identity>({
	className,
	debug = false,
	description,
	feedback = [],
	id,
	label,
	meta,
	name,
	options,
	required = false,
	...selectProps
}: Pick<
	ComponentProps<typeof Field>,
	| "className"
	| "debug"
	| "description"
	| "feedback"
	| "id"
	| "label"
	| "meta"
	| "name"
	| "required"
> &
	SelectHTMLAttributes<HTMLSelectElement> & {
		options: Array<TOption>;
	}) {
	return (
		<Field
			{...{
				debug,
				description,
				feedback,
				id,
				label,
				meta,
				name,
				required
			}}
			className={classNames(styles["select-field"], className)}
		>
			<select
				{...selectProps}
				{...{ id, name, required }}
				className={styles.select}
			>
				<option value="list">List</option>
				<option value="table">Table</option>
			</select>
		</Field>
	);
}

export const useSelectField = (
	{ fieldFeedback }: Pick<ReturnType<typeof useForm>, "fieldFeedback">,
	name: string,
	initialValue: string = ""
) => {
	const id = useId();

	const [value, setValue] = useState(initialValue);

	const [dirty, setDirty] = useState(false);
	const [focus, setFocus] = useState(false);

	const handleChange: ChangeEventHandler<HTMLSelectElement> = ({
		target: { value: newValue }
	}) => {
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
		value
	};
};
