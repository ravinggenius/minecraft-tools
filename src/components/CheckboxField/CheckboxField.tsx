"use client";

import { FieldApi } from "@tanstack/react-form";
import classNames from "classnames";
import { InputHTMLAttributes, useId, useState, ComponentProps } from "react"; // Added ComponentProps

import BaseField from "@/components/Field/Field"; // Renamed import for clarity
import { AppFormInstance } from "@/components/Form/Form";

import styles from "./CheckboxField.module.scss";

interface CheckboxFieldProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"name" | "id" | "value" | "checked" | "type" // 'value' & 'checked' controlled by form.Field
	> {
	form: AppFormInstance<any>;
	name: string;
	label: string;
	description?: string;
	examples?: Array<string>;
	className?: string; // Ensure className is part of props
	debug?: boolean; // Ensure debug is part of props
	// `required` is part of InputHTMLAttributes
}

export default function CheckboxField({
	form,
	name,
	label,
	className,
	description,
	examples = [],
	required = false, // Explicitly get required
	debug = false,
	...inputProps // Other native input props (e.g., disabled)
}: CheckboxFieldProps) {
	const fieldId = useId();
	const [isFocused, setIsFocused] = useState(false);

	return (
		<form.Field
			name={name}
			defaultValue={false} // Default value for a checkbox
			children={(field: FieldApi<any, boolean, any, any>) => {
				const fieldErrorMessages = Array.isArray(field.state.meta.errors)
					? field.state.meta.errors
					: field.state.meta.errors
					? [field.state.meta.errors] // Handle single error string
					: [];
				const fieldFeedback = fieldErrorMessages.map((msg) => ({
					message: String(msg), // Ensure message is a string
					type: "negative"
				}));

				return (
					<BaseField
						className={classNames(styles["checkbox-field"], className)}
						id={fieldId}
						label={label}
						name={field.name} // Pass field.name for context/debugging
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
						<input
							{...inputProps}
							id={fieldId}
							name={field.name}
							type="checkbox"
							checked={Boolean(field.state.value)}
							onBlur={() => {
								field.handleBlur();
								setIsFocused(false);
							}}
							onChange={(e) => field.handleChange(e.target.checked)}
							onFocus={() => setIsFocused(true)}
							required={required}
							className={styles.input}
						/>
					</BaseField>
				);
			}}
		/>
	);
}
