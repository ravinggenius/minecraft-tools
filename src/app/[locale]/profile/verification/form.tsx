"use client";

import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import Form from "@/components/Form/Form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function VerifyEmailtForm({
	action,
	className
}: {
	action: ServerAction;
	className?: string;
}) {
	const { t } = useTranslation("page-component-profile-verify-email-form");

	const query = useSearchParams();

	const formElement = useRef<HTMLFormElement>(null);

	useEffect(() => {
		formElement.current?.requestSubmit();
	});

	return (
		<Form
			{...{ action }}
			className={classNames(styles.form, className)}
			ref={formElement}
			submitLabel={t("submit")}
		>
			<input
				name="email"
				type="hidden"
				value={query.get("email") ?? ""}
			/>

			<input
				name="token"
				type="hidden"
				value={query.get("token") ?? ""}
			/>
		</Form>
	);
}
