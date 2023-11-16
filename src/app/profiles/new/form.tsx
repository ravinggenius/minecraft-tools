"use client";

import Form, { useForm } from "@/components/Form/Form";
import TextField, { useTextField } from "@/components/TextField/TextField";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/_/server-action";
import { ACCOUNT_CREATE_ATTRS } from "@/library/account/schema";

import styles from "./form.module.scss";

export default function CreateProfileForm({
	action: createProfile
}: {
	action: ServerAction;
}) {
	const { t } = useTranslation("page-component-new-profile-form");

	const form = useForm(createProfile, { schema: ACCOUNT_CREATE_ATTRS });

	const name = useTextField(form, "profile.name", "");

	const email = useTextField(form, "account.email", "");

	const password = useTextField(form, "account.password", "");

	const passwordConfirmation = useTextField(
		form,
		"account.passwordConfirmation",
		""
	);

	return (
		<Form {...form} className={styles.form} submitLabel={t("submit")}>
			<TextField {...name} label={t("name.label")} required />

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

			<TextField
				{...passwordConfirmation}
				label={t("password-confirmation.label")}
				required
				type="password"
			/>
		</Form>
	);
}
