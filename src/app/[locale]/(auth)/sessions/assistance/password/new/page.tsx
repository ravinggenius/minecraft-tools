import { Metadata } from "next";
import { redirect } from "next/navigation";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { maybeProfileFromSession } from "@/library/session-manager";

import initiateForgotPasswordResetAction from "./_actions/initiate-forgot-password-reset-action";
import SessionsAssistancePasswordNewForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/sessions/assistance/password/new">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password-new",
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
}: PageProps<"/[locale]/sessions/assistance/password/new">) {
	const { locale } = await ensureParams(PARAMS, params);

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "sessions" },
		{ name: "assistance" },
		{ name: "password" },
		{ name: "new" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password-new",
		{
			keyPrefix: "content"
		}
	);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.article}>
				<p>{t("instructions")}</p>

				<SessionsAssistancePasswordNewForm
					action={initiateForgotPasswordResetAction}
				/>
			</article>
		</>
	);
}
