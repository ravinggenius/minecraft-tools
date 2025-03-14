"use client";

import classNames from "classnames";
import { differenceInMilliseconds } from "date-fns";
import { useEffect, useState } from "react";

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

	const [show, setShow] = useState(false);

	useEffect(() => {
		const timerId = setTimeout(
			() => setShow(true),
			differenceInMilliseconds(resendReminderExpiry, new Date())
		);

		return () => {
			clearTimeout(timerId);
		};
	}, [resendReminderExpiry]);

	const form = useForm(resendVerification);

	return show ? (
		<Form
			{...form}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
		>
			<p>{t("instructions")}</p>
		</Form>
	) : null;
}
