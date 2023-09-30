"use client";

import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import { pick } from "rambda";

import Form, { useForm } from "@/components/Form/Form";
import { useTextField } from "@/components/TextField/TextField";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/_/types";

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

	const form = useForm(verifyEmail, DATA);

	const email = useTextField(form, "email", query.get("email") ?? "");

	const token = useTextField(form, "token", query.get("token") ?? "");

	return (
		<Form
			{...form}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
		>
			<input {...pick(["name", "value"], email)} type="hidden" />

			<input {...pick(["name", "value"], token)} type="hidden" />
		</Form>
	);
}
