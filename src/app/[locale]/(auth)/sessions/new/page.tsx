import { Metadata } from "next";
import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { maybeProfileFromSession } from "@/library/session-manager";

import createSessionAction from "./_actions/create-session-action";
import CreateSessionForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/sessions/new">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-sessions-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/sessions/new">) {
	const { locale } = await ensureParams(PARAMS, params);

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "sessions" },
		{ name: "new" }
	]);

	const { t } = await loadPageTranslations(locale, "page-sessions-new", {
		keyPrefix: "content"
	});

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.article}>
				<CreateSessionForm action={createSessionAction} />

				<Anchor href={`/${locale}/profiles/new`} variant="secondary">
					{t("sign-up-cta")}
				</Anchor>

				<Anchor
					href={`/${locale}/sessions/assistance/password/new`}
					variant="inline"
				>
					{t("password-assistance-cta")}
				</Anchor>
			</article>
		</>
	);
}
