import { redirect } from "next/navigation";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import {
	ensureParams,
	ensureSearchParams,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";
import { PageGenerateMetadata, PageProps } from "@/library/route-meta.schema";
import { maybeProfileFromSession } from "@/library/session-manager";

import styles from "./page.module.scss";
import { QUERY } from "./schema";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password-prompt",
		{ keyPrefix: "metadata" }
	);

	return {
		title: t("title")
	};
};

export default async function Page({ params, searchParams }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	try {
		const query = await ensureSearchParams(QUERY, searchParams);

		const crumbs = await buildBreadcrumbsWithPrefix(locale, [
			{ name: "sessions" },
			{ name: "assistance" },
			{ name: "password" },
			{ name: "prompt" }
		]);

		const { t } = await loadPageTranslations(
			locale,
			"page-sessions-assistance-password-prompt",
			{ keyPrefix: "content" }
		);

		return (
			<>
				<BreadcrumbTrailPortal {...{ crumbs }} />

				<article className={styles.article}>
					<p className={styles.instructions}>
						{t("instructions", { email: query.email })}
					</p>
				</article>
			</>
		);
	} catch (error: unknown) {
		if (
			error instanceof CodedError &&
			error.code === ERROR_CODE.SEARCH_QUERY_INVALID
		) {
			redirect(`/${locale}/sessions/new`);
		} else {
			throw error;
		}
	}
}
