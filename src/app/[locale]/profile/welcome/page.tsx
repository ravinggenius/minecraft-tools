import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as profileModel from "@/domains/profile/model";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { requireVerifiedProfile } from "@/library/session-manager";

import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/profile/welcome">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-welcome", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/profile/welcome">) {
	const { locale } = await ensureParams(PARAMS, params);

	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		await profileModel.markAsWelcomed(profile.id);
	}

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "profile" },
		{ name: "welcome" }
	]);

	const { t } = await loadPageTranslations(locale, "page-welcome", {
		keyPrefix: "content"
	});

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<main className={styles.main}>
				<p>{t("welcome", { name: profile.name })}</p>
			</main>
		</>
	);
}
