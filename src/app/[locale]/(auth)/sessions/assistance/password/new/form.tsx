"use client";

import Form from "@/components/Form/Form";
import { ACCOUNT } from "@/domains/account/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

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

	const form = useAppForm({
		defaultValues: {
			email: ""
		},
		validators: {
			onSubmit: ACCOUNT.pick({
				email: true
			})
		}
	});

	return (
		<Form
			action={action}
			{...{ className }}
			submitLabel={t("submit")}
			feedback={[]}
		>
			<form.AppField
				name="email"
				validators={{
					onChange: ACCOUNT.shape.email
				}}
			>
				{(field) => (
					<field.TextField
						description={t("email.description")}
						inputMode="email"
						label={t("email.label")}
						required
						type="email"
					/>
				)}
			</form.AppField>
		</Form>
	);
}
