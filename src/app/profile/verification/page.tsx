import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { requireProfile } from "@/library/_/session-manager";
import * as profileModel from "@/library/profile/model";

import { markEmailAsVerified } from "./actions";
import VerifyEmailtForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-profile-verification", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function ProfileVerification() {
	const { t } = await loadPageTranslations("page-profile-verification", {
		keyPrefix: "content"
	});

	const profile = await requireProfile();

	if (await profileModel.isEmailVerified(profile.id)) {
		redirect("/profile");
	}

	return (
		<article className={styles.article}>
			<p className={styles.intructions}>{t("instructions")}</p>

			<VerifyEmailtForm action={markEmailAsVerified} />
		</article>
	);
}
