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

import { useFieldContext } from "@/hooks/app-form";

import { Feedback } from "../FeedbackList/FeedbackList";
import { FieldMeta } from "../Field/Field";
import { FormServerFeedbackContext } from "../Form/Form";

import CheckboxField from "./CheckboxField";

export default function AppCheckboxField(
	props: Omit<
		ComponentProps<typeof CheckboxField>,
		| "checked"
		| "feedback"
		| "id"
		| "meta"
		| "name"
		| "onBlur"
		| "onChange"
		| "onFocus"
	> &
		Partial<Pick<ComponentProps<typeof CheckboxField>, "id">>
) {
	const serverFeedback = useContext(FormServerFeedbackContext);

	const id = useId();

	const field = useFieldContext<boolean>();

	const [isFocused, setIsFocused] = useState(false);

	const handleChange: ChangeEventHandler<HTMLInputElement> = ({
		target: { checked }
	}) => field.handleChange(checked);

	const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
		setIsFocused(true);
	};

	const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
		field.handleBlur();
		setIsFocused(false);
	};

	return (
		<CheckboxField
			{...props}
			checked={Boolean(field.state.value)}
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
		/>
	);
}
