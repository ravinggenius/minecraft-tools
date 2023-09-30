"use client";

import classNames from "classnames";

import Form, { useForm } from "@/components/Form/Form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/_/types";

import styles from "./form.module.css";

export default function VerifyEmailPromptForm({
	action: resendVerification,
	className
}: {
	action: ServerAction;
	className?: string;
}) {
	const { t } = useTranslation(
		"page-component-profile-verify-email-prompt-form"
	);

	const form = useForm(resendVerification);

	return (
		<Form
			{...form}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
		>
			<p>{t("instructions")}</p>
		</Form>
	);
}
