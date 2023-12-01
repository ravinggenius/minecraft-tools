import { addMinutes } from "date-fns";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import * as config from "@/library/_/config.mjs";
import { requireProfile } from "@/library/_/session";
import * as accountModel from "@/library/account/model";
import * as profileModel from "@/library/profile/model";

import { resendEmailVerification } from "./actions";
import VerifyEmailPromptForm from "./form";
import styles from "./page.module.scss";

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

	const tokenResendCount = await accountModel.getTokenNonceCount(profile.id);

	return (
		<article className={styles.article}>
			<p className={styles.intructions}>{t("instructions")}</p>

			<VerifyEmailPromptForm
				action={resendEmailVerification}
				resendReminderExpiry={addMinutes(
					new Date(),
					config.emailResendExpiryMinutes *
						Math.min(tokenResendCount, 10)
				)}
			/>
		</article>
	);
}
