"use client";

import classNames from "classnames";

import Form from "@/components/Form/Form";
import {
	ITEM_RELEASE_ATTRS,
	ItemReleaseAttrs
} from "@/domains/item-release/schema";
import { NormalizedItem } from "@/domains/item/schema";
import { Release } from "@/domains/release/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

const itemLabel = ({
	color,
	identifier,
	rarity,
	stackSize,
	translationKey,
	variant
}: NormalizedItem) => {
	const name = variant ? `${identifier} (${variant})` : identifier;

	const details = [color, rarity, `${stackSize}x`, translationKey]
		.filter(Boolean)
		.join(", ");

	return `${name} — ${details}`;
};

export default function ItemReleaseForm({
	action,
	attrs,
	className,
	isNew = false,
	items,
	releases
}: {
	action: ServerAction;
	attrs: ItemReleaseAttrs;
	className?: string;
	isNew?: boolean;
	items: Readonly<Array<NormalizedItem>>;
	releases: Readonly<Array<Release>>;
}) {
	const { t } = useTranslation("page-component-item-release-form");

	const form = useAppForm({
		defaultValues: attrs,
		validators: {
			onSubmit: ITEM_RELEASE_ATTRS
		}
	});

	return (
		<Form
			{...{ action, form }}
			className={classNames(styles.form, className)}
			submitLabel={t("submit", { context: isNew ? "new" : "edit" })}
		>
			<form.AppField
				name="releaseId"
				validators={{
					onChange: ITEM_RELEASE_ATTRS.shape.releaseId
				}}
			>
				{(field) => (
					<field.SelectField
						includeBlank
						label={t("release-id.label")}
						options={releases}
						required
						serialize={({ id }) => id}
					>
						{({ edition, version }) =>
							t("release.option", {
								edition: t("edition.name", {
									context: edition
								}),
								version
							})
						}
					</field.SelectField>
				)}
			</form.AppField>

			<form.AppField
				name="itemId"
				validators={{
					onChange: ITEM_RELEASE_ATTRS.shape.itemId
				}}
			>
				{(field) => (
					<field.SelectField
						includeBlank
						label={t("item-id.label")}
						options={items}
						required
						serialize={({ id }) => id}
					>
						{(item) => itemLabel(item)}
					</field.SelectField>
				)}
			</form.AppField>
		</Form>
	);
}
