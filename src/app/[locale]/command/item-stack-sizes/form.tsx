"use client";

import classNames from "classnames";
import { z } from "zod/v4";

import Form from "@/components/Form/Form";
import {
	ITEM_STACK_SIZE_ATTRS,
	ItemStackSizeAttrs
} from "@/domains/item-stack-size/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

const FORM_ATTRS = ITEM_STACK_SIZE_ATTRS.extend({
	identifier: z
		.string()
		.trim()
		.min(1)
		.transform(Number)
		.pipe(z.int().positive())
});

export default function ItemStackSizeForm({
	action,
	attrs,
	className,
	isNew = false
}: {
	action: ServerAction;
	attrs: ItemStackSizeAttrs;
	className?: string;
	isNew?: boolean;
}) {
	const { t } = useTranslation("page-component-item-stack-size-form");

	const form = useAppForm({
		defaultValues: {
			...attrs,
			identifier: String(attrs.identifier)
		},
		validators: {
			onSubmit: FORM_ATTRS
		}
	});

	return (
		<Form
			{...{ action, form }}
			className={classNames(styles.form, className)}
			submitLabel={t("submit", { context: isNew ? "new" : "edit" })}
		>
			<form.AppField
				name="identifier"
				validators={{
					onChange: FORM_ATTRS.shape.identifier
				}}
			>
				{(field) => (
					<field.TextField
						autoFocus
						label={t("identifier.label")}
						min={1}
						required
						type="number"
					/>
				)}
			</form.AppField>
		</Form>
	);
}
