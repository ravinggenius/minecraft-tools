"use client";

import Form, { useForm } from "@/components/Form/Form";
import TextField, { useTextField } from "@/components/TextField/TextField";
import { ServerAction } from "@/library/_/types";
import { ACCOUNT_CREATE_ATTRS } from "@/library/account/schema";

import styles from "./form.module.css";

export default function CreateProfileForm({
	action: createProfile
}: {
	action: ServerAction;
}) {
	const form = useForm(createProfile, ACCOUNT_CREATE_ATTRS);

	const name = useTextField(form, "profile.name", "");

	const email = useTextField(form, "account.email", "");

	const password = useTextField(form, "account.password", "");

	const passwordConfirmation = useTextField(
		form,
		"account.passwordConfirmation",
		""
	);

	return (
		<Form
			{...form}
			className={styles.form}
			debug
			submitLabel="Create Profile"
		>
			<TextField {...name} label="Name" required />

			<TextField {...email} label="Email" required type="email" />

			<TextField
				{...password}
				label="Password"
				required
				type="password"
			/>

			<TextField
				{...passwordConfirmation}
				label="Password Confirmation"
				required
				type="password"
			/>
		</Form>
	);
}
