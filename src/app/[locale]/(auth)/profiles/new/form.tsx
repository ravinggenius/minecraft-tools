"use client";

import Form from "@/components/Form/Form";
import { ACCOUNT_CREATE_ATTRS } from "@/domains/account/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function CreateProfileForm({
	action
}: {
	action: ServerAction;
}) {
	const { t } = useTranslation("page-component-new-profile-form");

	const form = useAppForm({
		defaultValues: {
			profile: {
				name: ""
			},
			account: {
				email: "",
				password: "",
				passwordConfirmation: ""
			}
		},
		validators: {
			onSubmit: ACCOUNT_CREATE_ATTRS
		}
	});

	return (
		<Form {...{ action }} className={styles.form} submitLabel={t("submit")}>
			<form.AppField
				name="profile.name"
				validators={{
					onChange: ACCOUNT_CREATE_ATTRS.shape.profile.shape.name
				}}
			>
				{(field) => (
					<field.TextField label={t("name.label")} required />
				)}
			</form.AppField>

			<form.AppField
				name="account.email"
				validators={{
					onChange: ACCOUNT_CREATE_ATTRS.shape.account.shape.email
				}}
			>
				{(field) => (
					<field.TextField
						label={t("email.label")}
						required
						type="email"
					/>
				)}
			</form.AppField>

			<form.AppField
				name="account.password"
				validators={{
					onChange: ACCOUNT_CREATE_ATTRS.shape.account.shape.password
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
				name="account.passwordConfirmation"
				validators={{
					onChange:
						ACCOUNT_CREATE_ATTRS.shape.account.shape
							.passwordConfirmation
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
