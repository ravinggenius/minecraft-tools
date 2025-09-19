"use client";

import classNames from "classnames";

import Form from "@/components/Form/Form";
import {
	RELEASE_CYCLE_ATTRS,
	ReleaseCycleAttrs
} from "@/domains/release-cycle/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function ReleaseCycleForm({
	action,
	attrs,
	className
}: {
	action: ServerAction;
	attrs: ReleaseCycleAttrs;
	className?: string;
}) {
	const { t } = useTranslation("page-component-release-cycle-form");

	const form = useAppForm({
		defaultValues: attrs,
		validators: {
			onSubmit: RELEASE_CYCLE_ATTRS
		}
	});

	return (
		<Form
			{...{ action, form }}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
		>
			<form.AppField
				name="name"
				validators={{ onChange: RELEASE_CYCLE_ATTRS.shape.name }}
			>
				{(field) => (
					<field.TextField
						autoFocus
						label={t("name.label")}
						required
					/>
				)}
			</form.AppField>
		</Form>
	);
}
