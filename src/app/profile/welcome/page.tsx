import { Metadata } from "next";

import { translation } from "@/i18n/server";
import { requireVerifiedProfile } from "@/library/_/session";
import * as profileModel from "@/library/profile/model";

import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await translation("page-welcome", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata;
};

export default async function WelcomePage() {
	const { t } = await translation("page-welcome", {
		keyPrefix: "content"
	});

	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		await profileModel.markAsWelcomed(profile.id);
	}

	return (
		<main className={styles.main}>
			<p>
				{t("welcome", {
					values: { name: profile.name }
				})}
			</p>
		</main>
	);
}
