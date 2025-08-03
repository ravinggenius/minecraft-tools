import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import Card from "@/components/Card/Card";
import Field from "@/components/Field/Field";
import TextField from "@/components/TextField/TextField";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { PageGenerateMetadata, PageProps } from "@/library/route-meta.schema";

import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
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
	};
};

export default async function Page({ params }: PageProps) {
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
					description={t("field.description")}
					label={t("field.label")}
					id={"some-unique-id"}
					name="foo"
					meta={{
						isDefaultValue: true,
						isDirty: false,
						isFocused: false,
						isPristine: true,
						isTouched: false,
						isValid: true
					}}
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
				/>
			</Card>
		</>
	);
}
