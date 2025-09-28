"use client";

import classNames from "classnames";
import { formatISO } from "date-fns";

import Button from "@/components/Button/Button";
import Form from "@/components/Form/Form";
import { Platform } from "@/domains/platform/schema";
import { ReleaseCycle } from "@/domains/release-cycle/schema";
import { EDITION, RELEASE_ATTRS, ReleaseAttrs } from "@/domains/release/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function ReleaseForm({
	action,
	attrs,
	className,
	cycles,
	isNew = false,
	platforms
}: {
	action: ServerAction;
	attrs: ReleaseAttrs;
	className?: string;
	cycles: ReadonlyArray<ReleaseCycle>;
	isNew?: boolean;
	platforms: ReadonlyArray<Platform>;
}) {
	const { t } = useTranslation(["page-component-release-form", "domains"]);

	const form = useAppForm({
		defaultValues: {
			edition: attrs.edition,
			version: attrs.version,
			cycle: {
				id: attrs.cycle.id ?? ""
			},
			developmentReleasedOn: attrs.developmentReleasedOn,
			changelog: attrs.changelog ?? "",
			isAvailableForTools: attrs.isAvailableForTools,
			platforms: attrs.platforms
		},
		validators: {
			// onSubmit: RELEASE_ATTRS
		}
	});

	return (
		<Form
			{...{ action, form }}
			className={classNames(styles.form, className)}
			submitLabel={t("submit", { context: isNew ? "new" : "edit" })}
		>
			<form.AppField
				name="edition"
				validators={
					{
						// onChange: RELEASE_ATTRS.shape.edition
					}
				}
			>
				{(field) => (
					<field.SelectField
						includeBlank
						label={t("edition.label")}
						options={EDITION.options.map((id) => ({ id }))}
						required
						serialize={({ id }) => id}
					>
						{({ id }) => t("edition.name", { edition: id })}
					</field.SelectField>
				)}
			</form.AppField>

			<form.AppField
				name="version"
				validators={
					{
						// onChange: RELEASE_ATTRS.shape.version
					}
				}
			>
				{(field) => (
					<field.TextField label={t("version.label")} required />
				)}
			</form.AppField>

			<form.AppField
				name="cycle.id"
				validators={
					{
						// onChange: RELEASE_ATTRS.shape.cycle.shape.id
					}
				}
			>
				{(field) => (
					<field.SelectField
						includeBlank
						label={t("cycle-id.label")}
						options={cycles}
						serialize={({ id }) => id}
					>
						{({ name }) => name}
					</field.SelectField>
				)}
			</form.AppField>

			<form.AppField
				name="developmentReleasedOn"
				validators={
					{
						// onChange: RELEASE_ATTRS.shape.developmentReleasedOn
					}
				}
			>
				{(field) => (
					<field.TextField
						label={t("development-released-on.label")}
						type="date"
					/>
				)}
			</form.AppField>

			<form.AppField
				name="changelog"
				// validators={{ onChange: RELEASE_ATTRS.shape.changelog }}
			>
				{(field) => (
					<field.TextField label={t("changelog.label")} type="url" />
				)}
			</form.AppField>

			<form.AppField
				name="isAvailableForTools"
				validators={
					{
						// onChange: RELEASE_ATTRS.shape.isAvailableForTools
					}
				}
			>
				{(field) => (
					<field.CheckboxField
						label={t("is-available-for-tools.label")}
					/>
				)}
			</form.AppField>

			<form.Field name="platforms" mode="array">
				{(field) => (
					<fieldset className={styles.platforms}>
						<legend>{t("platform-releases.legend")}</legend>

						{field.state.value.map((_, index) => (
							<div className={styles.platformRelease} key={index}>
								<form.AppField
									name={`platforms[${index}].id`}
									validators={{
										onChange: RELEASE_ATTRS.shape.platforms
											.unwrap()
											.unwrap().shape.id
									}}
								>
									{(subField) => (
										<subField.SelectField
											label={t(
												"platform-releases.platform.label"
											)}
											options={platforms}
											required
											serialize={({ id }) => id}
										>
											{({ name }) => name}
										</subField.SelectField>
									)}
								</form.AppField>

								<form.AppField
									name={`platforms[${index}].productionReleasedOn`}
									validators={{
										onChange: RELEASE_ATTRS.shape.platforms
											.unwrap()
											.unwrap().shape.productionReleasedOn
									}}
								>
									{(subField) => (
										<subField.TextField
											label={t(
												"platform-releases.production-released-on.label"
											)}
											required
											type="date"
										/>
									)}
								</form.AppField>

								<Button
									className={styles.removeButton}
									onClick={() => field.removeValue(index)}
									title={t("platform-releases.remove-button")}
									type="button"
									variant="secondary"
								>
									X
								</Button>
							</div>
						))}

						<Button
							className={styles.addButton}
							onClick={() =>
								field.pushValue({
									id: "",
									productionReleasedOn: formatISO(
										new Date(),
										{ representation: "date" }
									)
								})
							}
							type="button"
							variant="secondary"
						>
							{t("platform-releases.add-button")}
						</Button>
					</fieldset>
				)}
			</form.Field>
		</Form>
	);
}
