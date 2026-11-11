"use client";

import classNames from "classnames";
import { z } from "zod/v4";

import Form from "@/components/Form/Form";
import {
	ITEM_IDENTITY_ATTRS,
	ItemIdentityAttrs
} from "@/domains/item-identity/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

const FORM_ATTRS = ITEM_IDENTITY_ATTRS.extend({
	variant: ITEM_IDENTITY_ATTRS.shape.variant
		.unwrap()
		.unwrap()
		.or(z.undefined())
});

export default function ItemIdentityForm({
	action,
	attrs,
	className,
	isNew = false
}: {
	action: ServerAction;
	attrs: ItemIdentityAttrs;
	className?: string;
	isNew?: boolean;
}) {
	const { t } = useTranslation("page-component-item-identity-form");

	const form = useAppForm({
		defaultValues: {
			...attrs,
			variant: attrs.variant ?? undefined
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
					onChange: ITEM_IDENTITY_ATTRS.shape.identifier
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

			<form.AppField
				name="variant"
				validators={{
					onChange: FORM_ATTRS.shape.variant
				}}
			>
				{(field) => <field.TextField label={t("variant.label")} />}
			</form.AppField>
		</Form>
	);
}
