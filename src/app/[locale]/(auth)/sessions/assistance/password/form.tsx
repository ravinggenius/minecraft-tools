"use client";

import classNames from "classnames";

import Form from "@/components/Form/Form";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";
import { DATA, Query } from "./schema";

export default function SessionAssistancePasswordForm({
	action,
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

	const form = useAppForm({
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

	return (
		<Form
			{...{ action, form }}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
		>
			<input name="email" value={form.state.values.email} type="hidden" />
			<input name="token" value={form.state.values.token} type="hidden" />

			<form.AppField
				name="password"
				validators={{
					onChange: DATA.shape.password
				}}
			>
				{(field) => (
					<field.TextField
						label={t("password.label")}
						required
						type="password"
					/>
				)}
			</form.AppField>

			<form.AppField
				name="passwordConfirmation"
				validators={{
					onChange: DATA.shape.passwordConfirmation
				}}
			>
				{(field) => (
					<field.TextField
						label={t("password-confirmation.label")}
						required
						type="password"
					/>
				)}
			</form.AppField>
		</Form>
	);
}
