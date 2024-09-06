"use client";

import Form, { useForm } from "@/components/Form/Form";
import TextField, { useTextField } from "@/components/TextField/TextField";
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

	const form = useForm(createSession, { schema: SESSION_CREDENTIALS });

	const email = useTextField(form, "email", "");

	const password = useTextField(form, "password", "");

	return (
		<Form {...form} className={styles.form} submitLabel={t("submit")}>
			<TextField
				{...email}
				label={t("email.label")}
				required
				type="email"
			/>

			<TextField
				{...password}
				label={t("password.label")}
				required
				type="password"
			/>
		</Form>
	);
}
