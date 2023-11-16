import Field from "@/components/Field/Field";
import TextField from "@/components/TextField/TextField";
import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.scss";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-design-system-input", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function DesignSystemInputPage() {
	const { t } = await loadPageTranslations("page-design-system-input", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.article}>
			<p>{t("description")}</p>

			<header>
				<h1>{t("title")}</h1>
			</header>

			<section>
				<p>{t("field.explanation")}</p>

				<Field
					description={t("field.description")}
					label={t("field.label")}
					id={"some-unique-id"}
					name="foo"
					meta={{ dirty: false, focus: false }}
					required
				>
					<pre>{t("field.input-here")}</pre>
				</Field>
			</section>

			<section>
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
					meta={{ dirty: false, focus: false }}
					placeholder={t("text-field.placeholder")}
				/>
			</section>
		</article>
	);
}
