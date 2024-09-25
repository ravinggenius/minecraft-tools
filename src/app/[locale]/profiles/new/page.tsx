import { Metadata } from "next";
import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";
import { maybeProfileFromSession } from "@/library/session-manager";

import createProfileAction from "./_actions/create-profile-action";
import CreateProfileForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async ({ params }: PageProps) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-profiles-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-profiles-new", {
		keyPrefix: "content"
	});

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	return (
		<main className={styles.main}>
			<CreateProfileForm action={createProfileAction} />

			<Anchor href={`/${locale}/sessions/new`} variant="secondary">
				{t("log-in-cta")}
			</Anchor>
		</main>
	);
}
