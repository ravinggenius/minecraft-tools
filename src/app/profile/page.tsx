import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { requireVerifiedProfile } from "@/library/session-manager";

import styles from "./page.module.scss";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-profile", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function ProfilePage() {
	const { t } = await loadPageTranslations("page-profile", {
		keyPrefix: "content"
	});

	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		redirect("/profile/welcome");
	}

	return (
		<article className={styles.main}>
			<p>{t("description")}</p>
		</article>
	);
}
