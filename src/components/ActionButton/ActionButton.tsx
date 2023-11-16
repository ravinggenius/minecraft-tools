"use client";

import classNames from "classnames";
import { ComponentProps } from "react";

import Form, { useForm } from "../Form/Form";

import styles from "./ActionButton.module.scss";

export default function ActionButton({
	action,
	className,
	label,
	variant
}: Pick<ComponentProps<typeof Form>, "action" | "className"> & {
	label: ComponentProps<typeof Form>["submitLabel"];
	variant?: ComponentProps<typeof Form>["submitVariant"];
}) {
	const form = useForm(action);

	return (
		<Form
			{...form}
			className={classNames(styles.form, className)}
			submitLabel={label}
			submitVariant={variant}
		/>
	);
}
