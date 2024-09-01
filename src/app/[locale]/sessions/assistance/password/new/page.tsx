import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { maybeProfileFromSession } from "@/library/session-manager";

import initiateForgotPasswordResetAction from "./_actions/initiate-forgot-password-reset-action";
import SessionsAssistancePasswordNewForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password-new",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function NewSessionAssistancePasswordPage({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password-new",
		{
			keyPrefix: "content"
		}
	);

	return (
		<article className={styles.article}>
			<p>{t("instructions")}</p>

			<SessionsAssistancePasswordNewForm
				action={initiateForgotPasswordResetAction}
			/>
		</article>
	);
}
