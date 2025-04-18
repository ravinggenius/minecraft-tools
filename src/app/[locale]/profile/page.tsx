import { redirect } from "next/navigation";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { PageGenerateMetadata, PageProps } from "@/library/route-meta.schema";
import { requireVerifiedProfile } from "@/library/session-manager";

import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-profile", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		redirect(`/${locale}/profile/welcome`);
	}

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "profile" }
	]);

	const { t } = await loadPageTranslations(locale, "page-profile", {
		keyPrefix: "content"
	});

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.main}>
				<p>{t("description")}</p>
			</article>
		</>
	);
}
