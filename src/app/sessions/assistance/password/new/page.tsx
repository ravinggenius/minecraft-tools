import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { maybeProfileFromSession } from "@/library/session-manager";

import { initiateForgotPasswordReset } from "./actions";
import SessionsAssistancePasswordNewForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations(
		"page-sessions-assistance-password-new",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function NewSessionAssistancePasswordPage() {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	const { t } = await loadPageTranslations(
		"page-sessions-assistance-password-new",
		{
			keyPrefix: "content"
		}
	);

	return (
		<article className={styles.article}>
			<p>{t("instructions")}</p>

			<SessionsAssistancePasswordNewForm
				action={initiateForgotPasswordReset}
			/>
		</article>
	);
}
