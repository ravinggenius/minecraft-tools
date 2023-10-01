"use client";

import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import { pick } from "rambda";
import { useEffect, useRef } from "react";

import Form, { useForm } from "@/components/Form/Form";
import { useTextField } from "@/components/TextField/TextField";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/_/server-action";

import styles from "./form.module.css";
import { DATA } from "./schema";

export default function VerifyEmailtForm({
	action: verifyEmail,
	className
}: {
	action: ServerAction;
	className?: string;
}) {
	const { t } = useTranslation("page-component-profile-verify-email-form");

	const query = useSearchParams();

	const formElement = useRef<HTMLFormElement>(null);

	const form = useForm(verifyEmail, { schema: DATA });

	const email = useTextField(form, "email", query.get("email") ?? "");

	const token = useTextField(form, "token", query.get("token") ?? "");

	useEffect(() => {
		formElement.current?.requestSubmit();
	});

	return (
		<Form
			{...form}
			className={classNames(styles.form, className)}
			ref={formElement}
			submitLabel={t("submit")}
		>
			<input {...pick(["name", "value"], email)} type="hidden" />

			<input {...pick(["name", "value"], token)} type="hidden" />
		</Form>
	);
}
