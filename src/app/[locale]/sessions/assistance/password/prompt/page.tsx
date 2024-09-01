import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { maybeProfileFromSession } from "@/library/session-manager";

import styles from "./page.module.scss";
import { QUERY } from "./schema";

export const generateMetadata = async ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password-prompt",
		{ keyPrefix: "metadata" }
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function SessionsForgotPasswordPrompt({
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

	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password-prompt",
		{ keyPrefix: "content" }
	);

	return (
		<article className={styles.article}>
			<p className={styles.instructions}>
				{t("instructions", { email: query.data.email })}
			</p>
		</article>
	);
}
