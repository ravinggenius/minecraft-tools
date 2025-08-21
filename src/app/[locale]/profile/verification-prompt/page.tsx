import { addMinutes } from "date-fns";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as accountModel from "@/domains/account/model";
import * as profileModel from "@/domains/profile/model";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { requireProfile } from "@/library/session-manager";
import * as config from "@/services/config-service/service.mjs";

import resendEmailVerificationAction from "./_actions/resend-email-verification-action";
import VerifyEmailPromptForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/profile/verification-prompt">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-profile-verification-prompt",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/profile/verification-prompt">) {
	const { locale } = await ensureParams(PARAMS, params);

	const profile = await requireProfile();

	if (await profileModel.isEmailVerified(profile.id)) {
		redirect(`/${locale}/profile`);
	}

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "profile" },
		{ name: "verification-prompt" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-profile-verification-prompt",
		{
			keyPrefix: "content"
		}
	);

	const tokenResendCount = await accountModel.getTokenNonceCount(profile.id);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.article}>
				<p className={styles.intructions}>{t("instructions")}</p>

				<VerifyEmailPromptForm
					action={resendEmailVerificationAction}
					resendReminderExpiry={addMinutes(
						new Date(),
						config.emailResendExpiryMinutes *
							Math.min(tokenResendCount, 10)
					)}
				/>
			</article>
		</>
	);
}
