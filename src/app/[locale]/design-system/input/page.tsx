import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import Card from "@/components/Card/Card";
import Field from "@/components/Field/Field";
import TextField from "@/components/TextField/TextField";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/design-system/input">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-input",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/design-system/input">) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "design-system" },
		{ name: "input" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-input",
		{
			keyPrefix: "content"
		}
	);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<Card {...{ locale }} variant="flat">
				<p>{t("field.explanation")}</p>

				<Field
					debugValue={{
						debug: true,
						answer: 42
					}}
					description={t("field.description")}
					label={t("field.label")}
					id={"some-unique-id"}
					required
				>
					<pre>{t("field.input-here")}</pre>
				</Field>
			</Card>

			<Card {...{ locale }} variant="flat">
				<p>{t("text-field.explanation")}</p>

				<TextField
					description={t("text-field.description")}
					examples={[
						{
							sample: t("text-field.example.sample"),
							description: t("text-field.example.description")
						}
					]}
					feedback={[
						{
							type: "positive",
							message: t("text-field.feedback.positive")
						},
						{
							type: "neutral",
							message: t("text-field.feedback.neutral")
						},
						{
							type: "negative",
							message: t("text-field.feedback.negative")
						}
					]}
					label={t("text-field.label")}
					id={"some-unique-id"}
					name="color"
					meta={{
						isDefaultValue: true,
						isDirty: false,
						isFocused: false,
						isPristine: true,
						isTouched: false,
						isValid: true
					}}
					placeholder={t("text-field.placeholder")}
					value=""
				/>
			</Card>
		</>
	);
}
