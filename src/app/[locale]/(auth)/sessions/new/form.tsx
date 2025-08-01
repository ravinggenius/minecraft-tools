"use client";

import { useForm } from "@tanstack/react-form";
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
		validators: {
			onSubmit: SESSION_CREDENTIALS
		}
	});

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
			<TextField
				name="email"
				value={form.state.values.email}
				onChange={(e) => form.setFieldValue("email", e.target.value)}
				label={t("email.label")}
				required
				type="email"
				id="email"
				meta={{ dirty: false, focus: false }}
				feedback={
					form.state.fieldMeta.email?.errors?.map((error) => ({
						type: "negative" as const,
						message: error
					})) || []
				}
			/>

			<TextField
				name="password"
				value={form.state.values.password}
				onChange={(e) => form.setFieldValue("password", e.target.value)}
				label={t("password.label")}
				required
				type="password"
				id="password"
				meta={{ dirty: false, focus: false }}
				feedback={
					form.state.fieldMeta.password?.errors?.map((error) => ({
						type: "negative" as const,
						message: error
					})) || []
				}
			/>
		</Form>
	);
}
