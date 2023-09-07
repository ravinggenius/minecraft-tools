"use client";

import classNames from "classnames";

import Form, { useForm } from "@/components/Form/Form";
import { useTranslation } from "@/i18n/client";

import { deleteSession } from "./actions";
import styles from "./LogoutForm.module.css";

export default function LogoutForm({ className }: { className?: string }) {
	const { t } = useTranslation("component-logout-form");

	const form = useForm(deleteSession);

	return (
		<Form
			{...form}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
		/>
	);
}
