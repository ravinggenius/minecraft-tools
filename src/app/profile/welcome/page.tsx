import { Metadata } from "next";

import { loadPageTranslations } from "@/i18n/server";
import { requireVerifiedProfile } from "@/library/_/session-manager";
import * as profileModel from "@/library/profile/model";

import styles from "./page.module.scss";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-welcome", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function WelcomePage() {
	const { t } = await loadPageTranslations("page-welcome", {
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
