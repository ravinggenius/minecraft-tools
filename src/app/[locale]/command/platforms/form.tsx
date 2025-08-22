"use client";

import classNames from "classnames";

import Form from "@/components/Form/Form";
import { PLATFORM_ATTRS, PlatformAttrs } from "@/domains/platform/schema";
import { useAppForm } from "@/hooks/app-form";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function PlatformForm({
	action,
	attrs,
	className
}: {
	action: ServerAction;
	attrs: PlatformAttrs;
	className?: string;
}) {
	const { t } = useTranslation("page-component-platform-form");

	const form = useAppForm({
		defaultValues: attrs,
		validators: {
			onSubmit: PLATFORM_ATTRS
		}
	});

	return (
		<Form
			{...{ action }}
			className={classNames(styles.form, className)}
			submitLabel={t("submit")}
		>
			<form.AppField
				name="name"
				validators={{ onChange: PLATFORM_ATTRS.shape.name }}
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
