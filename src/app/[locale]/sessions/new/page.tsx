import { Metadata } from "next";
import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { maybeProfileFromSession } from "@/library/session-manager";

import { createSession } from "./actions";
import CreateSessionForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	const { t } = await loadPageTranslations(locale, "page-sessions-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function SessionsNewPage({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) {
	const { t } = await loadPageTranslations(locale, "page-sessions-new", {
		keyPrefix: "content"
	});

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	return (
		<article className={styles.article}>
			<CreateSessionForm action={createSession} />

			<Anchor href={`/${locale}/profiles/new`} variant="secondary">
				{t("sign-up-cta")}
			</Anchor>

			<Anchor
				href={`/${locale}/sessions/assistance/password/new`}
				variant="inline"
			>
				{t("password-assistance-cta")}
			</Anchor>
		</article>
	);
}
