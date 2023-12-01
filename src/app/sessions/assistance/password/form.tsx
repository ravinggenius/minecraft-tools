"use client";

import classNames from "classnames";
import { pick } from "rambda";

import Form, { useForm } from "@/components/Form/Form";
import TextField, { useTextField } from "@/components/TextField/TextField";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/_/server-action";

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

	const form = useForm(verifyEmail, { schema: DATA });

	const emailField = useTextField(form, "email", email);

	const tokenField = useTextField(form, "token", token);

	const password = useTextField(form, "password", "");

	const passwordConfirmation = useTextField(form, "passwordConfirmation", "");

	return (
		<Form
			{...form}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
		>
			<input {...pick(["name", "value"], emailField)} type="hidden" />

			<input {...pick(["name", "value"], tokenField)} type="hidden" />

			<TextField
				{...password}
				label={t("password.label")}
				required
				type="password"
			/>

			<TextField
				{...passwordConfirmation}
				label={t("password-confirmation.label")}
				required
				type="password"
			/>
		</Form>
	);
}
