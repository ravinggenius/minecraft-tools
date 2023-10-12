"use client";

import Form, { useForm } from "@/components/Form/Form";
import TextField, { useTextField } from "@/components/TextField/TextField";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/_/server-action";
import { ACCOUNT } from "@/library/account/schema";

export default function SessionsAssistancePasswordNewForm({
	action,
	className
}: {
	action: ServerAction;
	className?: string;
}) {
	const { t } = useTranslation(
		"page-component-sessions-assistance-password-new-form"
	);

	const form = useForm(action, {
		schema: ACCOUNT.pick({
			email: true
		})
	});

	const email = useTextField(form, "email", "");

	return (
		<Form {...form} {...{ className }} submitLabel={t("submit")}>
			<TextField
				{...email}
				description={t("email.description")}
				inputMode="email"
				label={t("email.label")}
				required
				type="email"
			/>
		</Form>
	);
}
