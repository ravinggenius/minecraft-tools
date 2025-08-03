"use client";

import { useForm } from "@tanstack/react-form";

import Form from "@/components/Form/Form";
import TextField from "@/components/TextField/TextField";
import { ACCOUNT } from "@/domains/account/schema";
import useFocusBlur from "@/hooks/use-focus-blur";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

export default function SessionsAssistancePasswordNewForm({
	action,
	className
}: {
	action: ServerAction;
	className?: string;
}) {
	const { t } = useTranslation(
		"page-component-sessions-assistance-password-new-form"
	);

	const form = useForm({
		defaultValues: {
			email: ""
		},
		validators: {
			onSubmit: ACCOUNT.pick({
				email: true
			})
		}
	});

	const emailFocus = useFocusBlur();

	return (
		<Form
			action={action}
			{...{ className }}
			submitLabel={t("submit")}
			feedback={[]}
		>
			<form.Field
				name="email"
				validators={{
					onChange: ACCOUNT.shape.email
				}}
			>
				{(field) => (
					<TextField
						name={field.name}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						onFocus={emailFocus.handleFocus}
						onBlur={emailFocus.makeHandleBlur(field)}
						description={t("email.description")}
						inputMode="email"
						label={t("email.label")}
						required
						type="email"
						id="email"
						meta={{
							...field.state.meta,
							isFocused: emailFocus.isFocused
						}}
						feedback={
							field.state.meta.errors
								?.map((error) => ({
									type: "negative" as const,
									message: error?.message || "Invalid email"
								}))
								.filter(Boolean) || []
						}
					/>
				)}
			</form.Field>
		</Form>
	);
}
