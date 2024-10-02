import { redirect } from "next/navigation";

import * as profileModel from "@/domains/profile/model";
import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageGenerateMetadata,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";
import { requireProfile } from "@/library/session-manager";

import markEmailAsVerifiedAction from "./_actions/mark-email-as-verified-action";
import VerifyEmailtForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-profile-verification",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-profile-verification",
		{
			keyPrefix: "content"
		}
	);

	const profile = await requireProfile();

	if (await profileModel.isEmailVerified(profile.id)) {
		redirect(`/${locale}/profile`);
	}

	return (
		<article className={styles.article}>
			<p className={styles.intructions}>{t("instructions")}</p>

			<VerifyEmailtForm action={markEmailAsVerifiedAction} />
		</article>
	);
}
