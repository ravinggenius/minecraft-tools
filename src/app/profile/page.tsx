import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { requireVerifiedProfile } from "@/library/_/session";

import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-about", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata;
};

export default async function ProfilePage() {
	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		redirect("/profile/welcome");
	}

	const { t } = await loadPageTranslations("page-profile", {
		keyPrefix: "content"
	});

	return (
		<main className={styles.main}>
			<p>{t("description")}</p>
		</main>
	);
}
