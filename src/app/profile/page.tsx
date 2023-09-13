import { Metadata } from "next";
import { redirect } from "next/navigation";

import { translation } from "@/i18n/server";
import { requireVerifiedProfile } from "@/library/_/session";

import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await translation("page-profile", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata;
};

export default async function ProfilePage() {
	const { t } = await translation("page-profile", {
		keyPrefix: "content"
	});

	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		redirect("/profile/welcome");
	}

	return (
		<main className={styles.main}>
			<p>{t("description")}</p>
		</main>
	);
}
