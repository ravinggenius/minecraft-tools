"use client";

import classNames from "classnames";

import Form, { useForm } from "@/components/Form/Form";

import { deleteSession } from "./actions";
import styles from "./LogoutForm.module.css";

export default function LogoutForm({ className }: { className?: string }) {
	const form = useForm(deleteSession);

	return (
		<Form
			{...form}
			className={classNames(styles.form, className)}
			submitLabel="Log Out"
		/>
	);
}
