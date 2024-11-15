import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { PageGenerateMetadata, PageProps } from "@/library/route-meta.schema";
import { maybeProfileFromSession } from "@/library/session-manager";

import initiateForgotPasswordResetAction from "./_actions/initiate-forgot-password-reset-action";
import SessionsAssistancePasswordNewForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password-new",
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
