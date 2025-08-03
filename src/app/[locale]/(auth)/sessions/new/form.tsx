"use client";

import { useForm } from "@tanstack/react-form";

import Form from "@/components/Form/Form";
import TextField from "@/components/TextField/TextField";
import { SESSION_CREDENTIALS } from "@/domains/session/schema";
import useFocusBlur from "@/hooks/use-focus-blur";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function CreateSessionForm({
	action: createSession
}: {
	action: ServerAction;
}) {
	const { t } = useTranslation("page-component-new-session-form");

	const form = useForm({
		defaultValues: {
			email: "",
			password: ""
		},
		validators: {
			onSubmit: SESSION_CREDENTIALS
		}
	});

	const emailFocus = useFocusBlur();
	const passwordFocus = useFocusBlur();

	// Create a wrapper action that works with the existing Form component
	const handleSubmit: ServerAction = async (data) => {
		// The data is already FormData, so we can pass it directly
		return await createSession(data);
	};

	return (
		<Form
			action={handleSubmit}
			className={styles.form}
			submitLabel={t("submit")}
			feedback={[]}
		>
			<form.Field
				name="email"
				validators={{
					onChange: SESSION_CREDENTIALS.shape.email
				}}
			>
				{(field) => (
					<TextField
						name={field.name}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						onFocus={emailFocus.handleFocus}
						onBlur={emailFocus.makeHandleBlur(field)}
						label={t("email.label")}
						required
						type="email"
						id="email"
						meta={{
							dirty: field.state.meta.isDirty,
							focus: emailFocus.isFocused
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

			<form.Field
				name="password"
				validators={{
					onChange: SESSION_CREDENTIALS.shape.password
				}}
			>
				{(field) => (
					<TextField
						name={field.name}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						onFocus={passwordFocus.handleFocus}
						onBlur={passwordFocus.makeHandleBlur(field)}
						label={t("password.label")}
						required
						type="password"
						id="password"
						meta={{
							dirty: field.state.meta.isDirty,
							focus: passwordFocus.isFocused
						}}
						feedback={
							field.state.meta.errors
								?.map((error) => ({
									type: "negative" as const,
									message:
										error?.message || "Invalid password"
								}))
								.filter(Boolean) || []
						}
					/>
				)}
			</form.Field>
		</Form>
	);
}
