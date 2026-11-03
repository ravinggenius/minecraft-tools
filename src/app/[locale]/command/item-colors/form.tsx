"use client";

import classNames from "classnames";

import Form from "@/components/Form/Form";
import { ITEM_COLOR_ATTRS, ItemColorAttrs } from "@/domains/item-color/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function ItemColorForm({
	action,
	attrs,
	className,
	isNew = false
}: {
	action: ServerAction;
	attrs: ItemColorAttrs;
	className?: string;
	isNew?: boolean;
}) {
	const { t } = useTranslation("page-component-item-color-form");

	const form = useAppForm({
		defaultValues: attrs,
		validators: {
			onSubmit: ITEM_COLOR_ATTRS
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
					onChange: ITEM_COLOR_ATTRS.shape.identifier
				}}
			>
				{(field) => (
					<field.TextField
						autoFocus
						label={t("identifier.label")}
						required
					/>
				)}
			</form.AppField>
		</Form>
	);
}
