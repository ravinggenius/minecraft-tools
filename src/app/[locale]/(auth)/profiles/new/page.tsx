import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { PageGenerateMetadata, PageProps } from "@/library/route-meta.schema";
import { maybeProfileFromSession } from "@/library/session-manager";

import createProfileAction from "./_actions/create-profile-action";
import CreateProfileForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-profiles-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "profiles" },
		{ name: "new" }
	]);

	const { t } = await loadPageTranslations(locale, "page-profiles-new", {
		keyPrefix: "content"
	});

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<main className={styles.main}>
				<CreateProfileForm action={createProfileAction} />

				<Anchor href={`/${locale}/sessions/new`} variant="secondary">
					{t("log-in-cta")}
				</Anchor>
			</main>
		</>
	);
}
