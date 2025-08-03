"use client";

import Form from "@/components/Form/Form";
import { SESSION_CREDENTIALS } from "@/domains/session/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function CreateSessionForm({
	action: createSession
}: {
	action: ServerAction;
}) {
	const { t } = useTranslation("page-component-new-session-form");

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: ""
		},
		validators: {
			onSubmit: SESSION_CREDENTIALS
		}
	});

	return (
		<Form
			action={createSession}
			className={styles.form}
			submitLabel={t("submit")}
			feedback={[]}
		>
			<form.AppField
				name="email"
				validators={{ onChange: SESSION_CREDENTIALS.shape.email }}
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
				name="password"
				validators={{ onChange: SESSION_CREDENTIALS.shape.password }}
			>
				{(field) => (
					<field.TextField
						label={t("password.label")}
						required
						type="password"
					/>
				)}
			</form.AppField>
		</Form>
	);
}
