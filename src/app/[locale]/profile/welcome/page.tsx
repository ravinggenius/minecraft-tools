import { Metadata } from "next";
import { ComponentProps } from "react";

import { CommonPageProps } from "@/app/common-page-props";
import { loadPageTranslations } from "@/app/i18n/server";
import { requireVerifiedProfile } from "@/library/_/session";
import * as profileModel from "@/library/profile/model";

import styles from "./page.module.css";

export const generateMetadata = async ({
	params: { locale }
}: ComponentProps<typeof WelcomePage>) => {
	const { t } = await loadPageTranslations(locale, "page-welcome", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata;
};

export default async function WelcomePage({
	params: { locale }
}: CommonPageProps) {
	const { t } = await loadPageTranslations(locale, "page-welcome", {
		keyPrefix: "content"
	});

	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		await profileModel.markAsWelcomed(profile.id);
	}

	return (
		<main className={styles.main}>
			<p>{t("welcome", { name: profile.name })}</p>
		</main>
	);
}
