import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { requireProfile } from "@/library/_/session";
import * as profileModel from "@/library/profile/model";

import { resendEmailVerification } from "./actions";
import VerifyEmailPromptForm from "./form";
import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations(
		"page-profile-verification-prompt",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function ProfileVerificationPrompt() {
	const { t } = await loadPageTranslations(
		"page-profile-verification-prompt",
		{
			keyPrefix: "content"
		}
	);

	const profile = await requireProfile();

	if (await profileModel.isEmailVerified(profile.id)) {
		redirect("/profile");
	}

	return (
		<article className={styles.article}>
			<p className={styles.intructions}>{t("instructions")}</p>

			<VerifyEmailPromptForm action={resendEmailVerification} />
		</article>
	);
}
