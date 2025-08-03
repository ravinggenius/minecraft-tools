"use client";

import { useForm } from "@tanstack/react-form";
import classNames from "classnames";

import Form from "@/components/Form/Form";
import TextField from "@/components/TextField/TextField";
import useFocusBlur from "@/hooks/use-focus-blur";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";
import { DATA, Query } from "./schema";

export default function SessionAssistancePasswordForm({
	action: verifyEmail,
	className,
	email,
	token
}: {
	action: ServerAction;
	className?: string;
	email: Query["email"];
	token: Query["token"];
}) {
	const { t } = useTranslation(
		"page-component-session-assistance-password-form"
	);

	const form = useForm({
		defaultValues: {
			email,
			token,
			password: "",
			passwordConfirmation: ""
		},
		validators: {
			onSubmit: DATA
		}
	});

	const passwordFocus = useFocusBlur();
	const passwordConfirmationFocus = useFocusBlur();

	return (
		<Form
			action={verifyEmail}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
			feedback={[]}
		>
			<input name="email" value={form.state.values.email} type="hidden" />
			<input name="token" value={form.state.values.token} type="hidden" />

			<form.Field
				name="password"
				validators={{
					onChange: DATA.shape.password
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

			<form.Field
				name="passwordConfirmation"
				validators={{
					onChange: DATA.shape.passwordConfirmation
				}}
			>
				{(field) => (
					<TextField
						name={field.name}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						onFocus={passwordConfirmationFocus.handleFocus}
						onBlur={passwordConfirmationFocus.makeHandleBlur(field)}
						label={t("password-confirmation.label")}
						required
						type="password"
						id="password-confirmation"
						meta={{
							dirty: field.state.meta.isDirty,
							focus: passwordConfirmationFocus.isFocused
						}}
						feedback={
							field.state.meta.errors
								?.map((error) => ({
									type: "negative" as const,
									message:
										error?.message ||
										"Invalid password confirmation"
								}))
								.filter(Boolean) || []
						}
					/>
				)}
			</form.Field>
		</Form>
	);
}
