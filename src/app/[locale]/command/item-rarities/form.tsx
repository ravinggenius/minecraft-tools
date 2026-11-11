"use client";

import classNames from "classnames";

import Form from "@/components/Form/Form";
import {
	ITEM_RARITY_ATTRS,
	ItemRarityAttrs
} from "@/domains/item-rarity/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function ItemRarityForm({
	action,
	attrs,
	className,
	isNew = false
}: {
	action: ServerAction;
	attrs: ItemRarityAttrs;
	className?: string;
	isNew?: boolean;
}) {
	const { t } = useTranslation("page-component-item-rarity-form");

	const form = useAppForm({
		defaultValues: attrs,
		validators: {
			onSubmit: ITEM_RARITY_ATTRS
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
					onChange: ITEM_RARITY_ATTRS.shape.identifier
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
