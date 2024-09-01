import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { maybeProfileFromSession } from "@/library/session-manager";

import resetForgottenPasswordAction from "./_actions/reset-forgotten-password-action";
import SessionAssistancePasswordForm from "./form";
import styles from "./page.module.scss";
import { QUERY } from "./schema";

export const generateMetadata = async ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function SessionAssistancePasswordPage({
	params: { locale },
	searchParams
}: {
	params: { locale: SupportedLocale };
	searchParams: {
		[key: string]: string | Array<string> | undefined;
	};
}) {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	const query = QUERY.safeParse(searchParams);

	if (!query.success) {
		redirect(`/${locale}/sessions/new`);
	}

	return (
		<article className={styles.article}>
			<SessionAssistancePasswordForm
				{...query.data}
				action={resetForgottenPasswordAction}
			/>
		</article>
	);
}
