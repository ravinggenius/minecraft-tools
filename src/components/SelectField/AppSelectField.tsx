"use client";

import { omit } from "rambda";
import { ComponentProps, useId } from "react";

import { Feedback } from "@/components/FeedbackList/FeedbackList";
import type { Option } from "@/components/ObjectSelect/ObjectSelect";
import SelectField from "@/components/SelectField/SelectField";
import { useFieldContext } from "@/hooks/app-form";

import { FieldMeta } from "../Field/Field";

export default function AppSelectField<TOption extends Option>(
	props: Omit<
		ComponentProps<typeof SelectField<TOption>>,
		"feedback" | "id" | "meta" | "name" | "onChange" | "value"
	> &
		Partial<Pick<ComponentProps<typeof SelectField<TOption>>, "id">>
) {
	const id = useId();

	const field = useFieldContext<TOption | undefined>();

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
					// focus/blur flow for ObjectSelect is internal
					isFocused: false
				} satisfies FieldMeta as FieldMeta
			}
			name={field.name}
			onChange={(next) => {
				field.handleChange(next);
			}}
			options={props.options}
			serialize={props.serialize}
			value={field.state.value}
		>
			{props.children}
		</SelectField>
	);
}
