"use client";

import { FieldApi } from "@tanstack/react-form";
import classNames from "classnames";
import { ComponentProps, useId, useState } from "react";

import BaseField from "@/components/Field/Field"; // Renamed import
import { AppFormInstance } from "@/components/Form/Form";
import ObjectSelect, { Option } from "@/components/ObjectSelect/ObjectSelect";

import styles from "./SelectField.module.scss";

// Based on the conceptual example, merging props for BaseField and ObjectSelect specifics
interface SelectFieldProps<TOption extends Option>
	extends Omit<
		ComponentProps<typeof BaseField>,
		"children" | "id" | "name" | "meta" | "feedback" // These are controlled by form.Field or internally
	> {
	form: AppFormInstance<any>; // Form instance
	name: string; // Name of the field in the form
	options: Array<TOption>;
	serialize: (option: TOption) => TOption["id"]; // TOption["id"] is more specific than string | number
	children: (option: TOption) => React.ReactNode; // Render prop for option content
	includeBlank?: boolean;
	// `label` and `required` are part of BaseField props and will be passed via ...restBaseFieldProps or explicitly
	// `examples` (string[]) specific to this component, to be mapped for BaseField
	examples?: Array<string>;
}

export default function SelectField<TOption extends Option>({
	form,
	name,
	label,
	options,
	serialize,
	children,
	className,
	description,
	examples = [],
	includeBlank = false,
	required = false,
	debug = false,
	...restBaseFieldProps // Capture other props for BaseField
}: SelectFieldProps<TOption>) {
	const fieldId = useId();
	const [isFocused, setIsFocused] = useState(false);

	return (
		<form.Field
			name={name}
			// The value type for a select with an optional blank option can be TOption | undefined
			children={(field: FieldApi<any, TOption | undefined, any, any>) => {
				const fieldErrorMessages = Array.isArray(field.state.meta.errors)
					? field.state.meta.errors
					: field.state.meta.errors
					? [field.state.meta.errors] // Handle single error string
					: [];
				const fieldFeedback = fieldErrorMessages.map((msg) => ({
					message: String(msg),
					type: "negative"
				}));

				const currentIncludeBlank =
					(includeBlank && !required) ||
					(includeBlank && required && !field.state.value);

				return (
					<BaseField
						{...restBaseFieldProps} // Spread other BaseField props
						className={classNames(styles.field, className)}
						id={fieldId}
						label={label}
						name={field.name} // Pass field.name to BaseField for context/debugging
						description={description}
						examples={examples.map((example) => ({ content: example }))}
						feedback={fieldFeedback}
						meta={{
							dirty: field.state.meta.isTouched,
							focus: isFocused
						}}
						required={required}
						debug={debug}
					>
						<ObjectSelect<TOption>
							id={fieldId}
							name={field.name}
							options={options}
							value={field.state.value} // Value from form field state
							onChange={(newValue: TOption | undefined) => {
								field.handleChange(newValue);
							}}
							onFocus={() => setIsFocused(true)}
							onBlur={() => {
								field.handleBlur();
								setIsFocused(false);
							}}
							serialize={serialize}
							includeBlank={currentIncludeBlank}
							required={required} // Pass required to ObjectSelect for its own logic if any
							// disabled={field.form.state.isSubmitting} // Example: disable if form is submitting
						>
							{children}
						</ObjectSelect>
					</BaseField>
				);
			}}
		/>
	);
}
