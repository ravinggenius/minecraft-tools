"use client";

import { useForm } from "@tanstack/react-form";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import Form from "@/components/Form/Form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";
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

	const form = useForm({
		defaultValues: {
			email: query.get("email") ?? "",
			token: query.get("token") ?? ""
		},
		validators: {
			onSubmit: DATA
		}
	});

	useEffect(() => {
		formElement.current?.requestSubmit();
	});

	return (
		<Form
			action={verifyEmail}
			className={classNames(styles.form, className)}
			ref={formElement}
			submitLabel={t("submit")}
			feedback={[]}
		>
			<input name="email" value={form.state.values.email} type="hidden" />

			<input name="token" value={form.state.values.token} type="hidden" />
		</Form>
	);
}
