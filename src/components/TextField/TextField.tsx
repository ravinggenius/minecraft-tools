"use client";

import { FieldApi } from "@tanstack/react-form";
import classNames from "classnames";
import { InputHTMLAttributes, useId, useState } from "react";

import BaseField from "@/components/Field/Field"; // Renamed import for clarity
import { AppFormInstance } from "@/components/Form/Form";

import styles from "./TextField.module.scss";

interface TextFieldProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
	form: AppFormInstance<any>; // Using AppFormInstance
	name: string;
	label: string;
	className?: string;
	description?: string;
	examples?: Array<string>;
	debug?: boolean;
	// `required` is part of InputHTMLAttributes
}

export default function TextField({
	form,
	name,
	label,
	className,
	description,
	examples = [],
	debug = false,
	required = false, // Explicitly get required for BaseField, even if it's in inputProps
	...inputProps
}: TextFieldProps) {
	const inputId = useId();
	const [isFocused, setIsFocused] = useState(false);

	return (
		<form.Field
			name={name}
			// Example of a simple field-level validator, adjust as needed or remove
			// validators={{
			//   onChange: ({ value }) =>
			//     required && !value ? "This field is required" : undefined,
			// }}
			children={(field: FieldApi<any, any, any, any>) => {
				// Ensure field.state.meta.errors is always an array before mapping
				const fieldErrorMessages = Array.isArray(field.state.meta.errors)
					? field.state.meta.errors
					: [];
				const fieldFeedback = fieldErrorMessages.map((msg) => ({
					message: String(msg), // Ensure message is a string
					type: "negative"
				}));

				return (
					<BaseField
						className={classNames(styles["text-field"], className)}
						id={inputId}
						label={label}
						name={field.name} // Use field.name for BaseField's name prop
						description={description}
						examples={examples.map((example) => ({ content: example }))}
						feedback={fieldFeedback}
						meta={{
							dirty: field.state.meta.isTouched,
							focus: isFocused
						}}
						required={required} // Pass required to BaseField
						debug={debug}
					>
						<input
							{...inputProps} // Spread other native input props first
							id={inputId}
							name={field.name}
							value={(field.state.value as string) ?? ""} // Ensure value is controlled and defaults to empty string
							onBlur={() => {
								field.handleBlur();
								setIsFocused(false);
							}}
							onChange={(e) => field.handleChange(e.target.value)}
							onFocus={() => setIsFocused(true)}
							required={required} // Pass required to input element
							className={styles.input}
						/>
					</BaseField>
				);
			}}
		/>
	);
}
