"use client";

import Form, { useForm } from "@/components/Form/Form";
import TextField, { useTextField } from "@/components/TextField/TextField";
import { ServerAction } from "@/library/_/types";
import { SESSION_CREDENTIALS } from "@/library/session/schema";

import styles from "./form.module.css";

export default function CreateSessionForm({
	action: createSession
}: {
	action: ServerAction;
}) {
	const form = useForm(createSession, SESSION_CREDENTIALS);

	const email = useTextField(form, "email", "");

	const password = useTextField(form, "password", "");

	return (
		<Form {...form} className={styles.form} submitLabel="Create Session">
			<TextField {...email} label="Email" required type="email" />

			<TextField
				{...password}
				label="Password"
				required
				type="password"
			/>
		</Form>
	);
}
