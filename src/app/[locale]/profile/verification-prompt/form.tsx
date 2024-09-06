"use client";

import classNames from "classnames";
import { useTimer } from "react-timer-hook";

import Form, { useForm } from "@/components/Form/Form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function VerifyEmailPromptForm({
	action: resendVerification,
	className,
	resendReminderExpiry
}: {
	action: ServerAction;
	className?: string;
	resendReminderExpiry: Date;
}) {
	const { t } = useTranslation(
		"page-component-profile-verify-email-prompt-form"
	);

	const timer = useTimer({
		expiryTimestamp: resendReminderExpiry
	});

	const form = useForm(resendVerification);

	return timer.isRunning ? null : (
		<Form
			{...form}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
		>
			<p>{t("instructions")}</p>
		</Form>
	);
}
