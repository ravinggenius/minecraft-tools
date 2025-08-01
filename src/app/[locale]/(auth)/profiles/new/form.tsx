"use client";

import { useForm } from "@tanstack/form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod/v4";

import Form from "@/components/Form/Form";
import TextField from "@/components/TextField/TextField";
import { ACCOUNT_CREATE_ATTRS } from "@/domains/account/schema";
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
		validatorAdapter: zodValidator,
		validators: {
			onSubmit: ACCOUNT_CREATE_ATTRS
		}
	});

	// Create a wrapper action that uses the form state
	const handleSubmit: ServerAction = async (data) => {
		// Use the form state values instead of the data parameter
		const formData = form.state.values;
		const result = await form.validate();
		if (!result.success) {
			return { issues: result.error.issues };
		}
		return await createProfile(formData);
	};

	return (
		<Form
			action={handleSubmit}
			className={styles.form}
			submitLabel={t("submit")}
			feedback={
				form.state.submitFailure?.message
					? [
							{
								type: "error",
								message: form.state.submitFailure.message
							}
						]
					: []
			}
		>
			<TextField
				name="profile.name"
				value={form.state.values.profile.name}
				onChange={(e) =>
					form.setFieldValue("profile.name", e.target.value)
				}
				onBlur={() => form.validateField("profile.name")}
				label={t("name.label")}
				required
				feedback={
					form.state.fieldMeta.profile?.name?.errors?.map(
						(error) => ({ type: "error", message: error })
					) || []
				}
			/>

			<TextField
				name="account.email"
				value={form.state.values.account.email}
				onChange={(e) =>
					form.setFieldValue("account.email", e.target.value)
				}
				onBlur={() => form.validateField("account.email")}
				label={t("email.label")}
				required
				type="email"
				feedback={
					form.state.fieldMeta.account?.email?.errors?.map(
						(error) => ({ type: "error", message: error })
					) || []
				}
			/>

			<TextField
				name="account.password"
				value={form.state.values.account.password}
				onChange={(e) =>
					form.setFieldValue("account.password", e.target.value)
				}
				onBlur={() => form.validateField("account.password")}
				label={t("password.label")}
				required
				type="password"
				feedback={
					form.state.fieldMeta.account?.password?.errors?.map(
						(error) => ({ type: "error", message: error })
					) || []
				}
			/>

			<TextField
				name="account.passwordConfirmation"
				value={form.state.values.account.passwordConfirmation}
				onChange={(e) =>
					form.setFieldValue(
						"account.passwordConfirmation",
						e.target.value
					)
				}
				onBlur={() =>
					form.validateField("account.passwordConfirmation")
				}
				label={t("password-confirmation.label")}
				required
				type="password"
				feedback={
					form.state.fieldMeta.account?.passwordConfirmation?.errors?.map(
						(error) => ({ type: "error", message: error })
					) || []
				}
			/>
		</Form>
	);
}
