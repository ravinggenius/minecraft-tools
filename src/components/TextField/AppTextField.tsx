"use client";

import { omit } from "rambda";
import {
	ChangeEventHandler,
	ComponentProps,
	FocusEventHandler,
	useContext,
	useId,
	useState
} from "react";

import TextField from "@/components/TextField/TextField";
import { useFieldContext } from "@/hooks/app-form";

import { Feedback } from "../FeedbackList/FeedbackList";
import { FieldMeta } from "../Field/Field";
import { FormServerFeedbackContext } from "../Form/Form";

export default function AppTextField(
	props: Omit<
		ComponentProps<typeof TextField>,
		| "feedback"
		| "id"
		| "meta"
		| "name"
		| "onBlur"
		| "onChange"
		| "onFocus"
		| "value"
	> &
		Partial<Pick<ComponentProps<typeof TextField>, "id">>
) {
	const serverFeedback = useContext(FormServerFeedbackContext);

	const id = useId();

	const field = useFieldContext<string>();

	const [isFocused, setIsFocused] = useState(false);

	const handleChange: ChangeEventHandler<HTMLInputElement> = ({
		target: { value: newValue }
	}) => field.handleChange(newValue);

	const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
		setIsFocused(true);
	};

	const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
		field.handleBlur();
		setIsFocused(false);
	};

	return (
		<TextField
			{...props}
			feedback={[
				...(serverFeedback[field.name] ?? []),
				...field.state.meta.errors
					.filter(Boolean)
					.map<Feedback>((error) => ({
						message: error.message,
						type: "negative"
					}))
			]}
			id={props.id ?? id}
			meta={
				{
					...omit(["errors", "errorMap", "errorSourceMap"])(
						field.state.meta
					),
					isFocused
				} satisfies FieldMeta as FieldMeta
			}
			name={field.name}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			value={field.state.value}
		/>
	);
}
