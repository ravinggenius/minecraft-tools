"use client";

import { useForm } from "@tanstack/form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod/v4";

import Form from "@/components/Form/Form";
import TextField from "@/components/TextField/TextField";
import { SESSION_CREDENTIALS } from "@/domains/session/schema";
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
		validatorAdapter: zodValidator,
		validators: {
			onSubmit: SESSION_CREDENTIALS
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
		return await createSession(formData);
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
				name="email"
				value={form.state.values.email}
				onChange={(e) => form.setFieldValue("email", e.target.value)}
				onBlur={() => form.validateField("email")}
				label={t("email.label")}
				required
				type="email"
				feedback={
					form.state.fieldMeta.email?.errors?.map((error) => ({
						type: "error",
						message: error
					})) || []
				}
			/>

			<TextField
				name="password"
				value={form.state.values.password}
				onChange={(e) => form.setFieldValue("password", e.target.value)}
				onBlur={() => form.validateField("password")}
				label={t("password.label")}
				required
				type="password"
				feedback={
					form.state.fieldMeta.password?.errors?.map((error) => ({
						type: "error",
						message: error
					})) || []
				}
			/>
		</Form>
	);
}
