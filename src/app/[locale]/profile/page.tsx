import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ComponentProps } from "react";

import { CommonPageProps } from "@/app/common-page-props";
import { loadPageTranslations } from "@/app/i18n/server";
import { requireVerifiedProfile } from "@/library/_/session";

import styles from "./page.module.css";

export const generateMetadata = async ({
	params: { locale }
}: ComponentProps<typeof ProfilePage>) => {
	const { t } = await loadPageTranslations(locale, "page-about", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata;
};

export default async function ProfilePage({
	params: { locale }
}: CommonPageProps) {
	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		redirect("/profile/welcome");
	}

	const { t } = await loadPageTranslations(locale, "page-profile", {
		keyPrefix: "content"
	});

	return (
		<main className={styles.main}>
			<p>{t("description")}</p>
		</main>
	);
}
