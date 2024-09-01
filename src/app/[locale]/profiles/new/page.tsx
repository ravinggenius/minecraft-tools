import { Metadata } from "next";
import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { maybeProfileFromSession } from "@/library/session-manager";

import { createProfile } from "./actions";
import CreateProfileForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	const { t } = await loadPageTranslations(locale, "page-profiles-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function ProfilesNewPage({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) {
	const { t } = await loadPageTranslations(locale, "page-profiles-new", {
		keyPrefix: "content"
	});

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	return (
		<main className={styles.main}>
			<CreateProfileForm action={createProfile} />

			<Anchor href={`/${locale}/sessions/new`} variant="secondary">
				{t("log-in-cta")}
			</Anchor>
		</main>
	);
}
