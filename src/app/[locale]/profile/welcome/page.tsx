import { Metadata } from "next";

import * as profileModel from "@/domains/profile/model";
import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";
import { requireVerifiedProfile } from "@/library/session-manager";

import styles from "./page.module.scss";

export const generateMetadata = async ({ params }: PageProps) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-welcome", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-welcome", {
		keyPrefix: "content"
	});

	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		await profileModel.markAsWelcomed(profile.id);
	}

	return (
		<main className={styles.main}>
			<p>{t("welcome", { name: profile.name })}</p>
		</main>
	);
}
