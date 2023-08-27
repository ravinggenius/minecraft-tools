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

import styles from "./TextField.module.css";

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
	{ formFeedback }: Pick<ReturnType<typeof useForm>, "formFeedback">,
	name: string,
	initialValue: string = ""
) => {
	const id = useId();

	const [value, setValue] = useState(initialValue);

	const [dirty, setDirty] = useState(false);
	const [focus, setFocus] = useState(false);

	const handleChange: ChangeEventHandler<HTMLInputElement> = ({
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
		feedback: formFeedback[name],
		id,
		meta: {
			dirty,
			focus
		} satisfies FieldMeta,
		name,
		onChange: handleChange,
		onFocus: handleFocus,
		onBlur: handleBlur,
		value
	};
};
