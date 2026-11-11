"use client";

import classNames from "classnames";
import { z } from "zod/v4";

import Form from "@/components/Form/Form";
import { ItemColor } from "@/domains/item-color/schema";
import { ItemIdentity } from "@/domains/item-identity/schema";
import { ItemRarity } from "@/domains/item-rarity/schema";
import { ItemStackSize } from "@/domains/item-stack-size/schema";
import { ItemTranslationKey } from "@/domains/item-translation-key/schema";
import { ITEM_ATTRS, ItemAttrs } from "@/domains/item/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

const FORM_ATTRS = ITEM_ATTRS.extend({
	itemColorId: ITEM_ATTRS.shape.itemColorId
		.unwrap()
		.unwrap()
		.or(z.undefined()),
	itemTranslationKeyId: ITEM_ATTRS.shape.itemTranslationKeyId
		.unwrap()
		.unwrap()
		.or(z.undefined())
});

export default function ItemForm({
	action,
	attrs,
	className,
	colors,
	identities,
	isNew = false,
	rarities,
	stackSizes,
	translationKeys
}: {
	action: ServerAction;
	attrs: ItemAttrs;
	className?: string;
	colors: ReadonlyArray<ItemColor>;
	identities: ReadonlyArray<ItemIdentity>;
	isNew?: boolean;
	rarities: ReadonlyArray<ItemRarity>;
	stackSizes: ReadonlyArray<ItemStackSize>;
	translationKeys: ReadonlyArray<ItemTranslationKey>;
}) {
	const { t } = useTranslation("page-component-item-form");

	const form = useAppForm({
		defaultValues: {
			itemIdentityId: attrs.itemIdentityId,
			itemColorId: attrs.itemColorId ?? undefined,
			itemRarityId: attrs.itemRarityId,
			itemStackSizeId: attrs.itemStackSizeId,
			itemTranslationKeyId: attrs.itemTranslationKeyId ?? undefined
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
				name="itemIdentityId"
				validators={{
					onChange: ITEM_ATTRS.shape.itemIdentityId
				}}
			>
				{(field) => (
					<field.SelectField
						includeBlank
						label={t("item-identity-id.label")}
						options={identities}
						required
						serialize={({ id }) => id}
					>
						{({ identifier, variant }) =>
							variant ? `${identifier} (${variant})` : identifier
						}
					</field.SelectField>
				)}
			</form.AppField>

			<form.AppField
				name="itemColorId"
				validators={{
					onChange: FORM_ATTRS.shape.itemColorId
				}}
			>
				{(field) => (
					<field.SelectField
						includeBlank
						label={t("item-color-id.label")}
						options={colors}
						serialize={({ id }) => id}
					>
						{({ identifier }) => identifier}
					</field.SelectField>
				)}
			</form.AppField>

			<form.AppField
				name="itemRarityId"
				validators={{
					onChange: ITEM_ATTRS.shape.itemRarityId
				}}
			>
				{(field) => (
					<field.SelectField
						includeBlank
						label={t("item-rarity-id.label")}
						options={rarities}
						required
						serialize={({ id }) => id}
					>
						{({ identifier }) => identifier}
					</field.SelectField>
				)}
			</form.AppField>

			<form.AppField
				name="itemStackSizeId"
				validators={{
					onChange: ITEM_ATTRS.shape.itemStackSizeId
				}}
			>
				{(field) => (
					<field.SelectField
						includeBlank
						label={t("item-stack-size-id.label")}
						options={stackSizes}
						required
						serialize={({ id }) => id}
					>
						{({ identifier }) => String(identifier)}
					</field.SelectField>
				)}
			</form.AppField>

			<form.AppField
				name="itemTranslationKeyId"
				validators={{
					onChange: FORM_ATTRS.shape.itemTranslationKeyId
				}}
			>
				{(field) => (
					<field.SelectField
						includeBlank
						label={t("item-translation-key-id.label")}
						options={translationKeys}
						serialize={({ id }) => id}
					>
						{({ identifier }) => identifier}
					</field.SelectField>
				)}
			</form.AppField>
		</Form>
	);
}
