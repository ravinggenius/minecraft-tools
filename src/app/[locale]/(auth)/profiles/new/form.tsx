"use client";

import { useForm } from "@tanstack/react-form";

import Form from "@/components/Form/Form";
import TextField from "@/components/TextField/TextField";
import { ACCOUNT_CREATE_ATTRS } from "@/domains/account/schema";
import useFocusBlur from "@/hooks/use-focus-blur";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function CreateProfileForm({
	action: createProfile
}: {
	action: ServerAction;
}) {
	const { t } = useTranslation("page-component-new-profile-form");

	const form = useForm({
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

	const profileNameFocus = useFocusBlur();
	const accountEmailFocus = useFocusBlur();
	const accountPasswordFocus = useFocusBlur();
	const accountPasswordConfirmationFocus = useFocusBlur();

	return (
		<Form
			action={createProfile}
			className={styles.form}
			submitLabel={t("submit")}
			feedback={[]}
		>
			<form.Field
				name="profile.name"
				validators={{
					onChange: ACCOUNT_CREATE_ATTRS.shape.profile.shape.name
				}}
			>
				{(field) => (
					<TextField
						name={field.name}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						onFocus={profileNameFocus.handleFocus}
						onBlur={profileNameFocus.makeHandleBlur(field)}
						label={t("name.label")}
						required
						id="profile-name"
						meta={{
							...field.state.meta,
							isFocused: profileNameFocus.isFocused
						}}
						feedback={
							field.state.meta.errors
								?.map((error) => ({
									type: "negative" as const,
									message: error?.message || "Invalid name"
								}))
								.filter(Boolean) || []
						}
					/>
				)}
			</form.Field>

			<form.Field
				name="account.email"
				validators={{
					onChange: ACCOUNT_CREATE_ATTRS.shape.account.shape.email
				}}
			>
				{(field) => (
					<TextField
						name={field.name}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						onFocus={accountEmailFocus.handleFocus}
						onBlur={accountEmailFocus.makeHandleBlur(field)}
						label={t("email.label")}
						required
						type="email"
						id="account-email"
						meta={{
							...field.state.meta,
							isFocused: accountEmailFocus.isFocused
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
				name="account.password"
				validators={{
					onChange: ACCOUNT_CREATE_ATTRS.shape.account.shape.password
				}}
			>
				{(field) => (
					<TextField
						name={field.name}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						onFocus={accountPasswordFocus.handleFocus}
						onBlur={accountPasswordFocus.makeHandleBlur(field)}
						label={t("password.label")}
						required
						type="password"
						id="account-password"
						meta={{
							...field.state.meta,
							isFocused: accountPasswordFocus.isFocused
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
				name="account.passwordConfirmation"
				validators={{
					onChange:
						ACCOUNT_CREATE_ATTRS.shape.account.shape
							.passwordConfirmation
				}}
			>
				{(field) => (
					<TextField
						name={field.name}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						onFocus={accountPasswordConfirmationFocus.handleFocus}
						onBlur={accountPasswordConfirmationFocus.makeHandleBlur(
							field
						)}
						label={t("password-confirmation.label")}
						required
						type="password"
						id="account-password-confirmation"
						meta={{
							...field.state.meta,
							isFocused:
								accountPasswordConfirmationFocus.isFocused
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
