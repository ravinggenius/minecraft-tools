"use client";

import { omit } from "rambda";
import { ComponentProps, FocusEventHandler, useId, useState } from "react";

import { Feedback } from "@/components/FeedbackList/FeedbackList";
import type { Option } from "@/components/ObjectSelect/ObjectSelect";
import SelectField from "@/components/SelectField/SelectField";
import { useFieldContext } from "@/hooks/app-form";

import { FieldMeta } from "../Field/Field";

export default function AppSelectField<TOption extends Option>(
	props: Omit<
		ComponentProps<typeof SelectField<TOption>>,
		| "feedback"
		| "id"
		| "meta"
		| "name"
		| "onBlur"
		| "onChange"
		| "onFocus"
		| "value"
	> &
		Partial<Pick<ComponentProps<typeof SelectField<TOption>>, "id">>
) {
	const id = useId();

	const field = useFieldContext<TOption | undefined>();

	const [isFocused, setIsFocused] = useState(false);

	const handleFocus: FocusEventHandler<HTMLSelectElement> = () => {
		setIsFocused(true);
	};

	const handleBlur: FocusEventHandler<HTMLSelectElement> = () => {
		field.handleBlur();
		setIsFocused(false);
	};

	return (
		<SelectField<TOption>
			{...props}
			feedback={field.state.meta.errors
				.filter(Boolean)
				.map<Feedback>((error) => ({
					message: error.message,
					type: "negative"
				}))}
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
			onChange={(next) => {
				field.handleChange(next);
			}}
			onFocus={handleFocus}
			onBlur={handleBlur}
			options={props.options}
			serialize={props.serialize}
			value={field.state.value}
		>
			{props.children}
		</SelectField>
	);
}
