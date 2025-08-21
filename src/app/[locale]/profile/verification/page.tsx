import { Metadata } from "next";
import { redirect } from "next/navigation";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as profileModel from "@/domains/profile/model";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { requireProfile } from "@/library/session-manager";

import markEmailAsVerifiedAction from "./_actions/mark-email-as-verified-action";
import VerifyEmailtForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/profile/verification">) => {
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
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/profile/verification">) {
	const { locale } = await ensureParams(PARAMS, params);

	const profile = await requireProfile();

	if (await profileModel.isEmailVerified(profile.id)) {
		redirect(`/${locale}/profile`);
	}

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "profile" },
		{ name: "verification" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-profile-verification",
		{
			keyPrefix: "content"
		}
	);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.article}>
				<p className={styles.intructions}>{t("instructions")}</p>

				<VerifyEmailtForm action={markEmailAsVerifiedAction} />
			</article>
		</>
	);
}
