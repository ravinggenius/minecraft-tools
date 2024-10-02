import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import {
	ensureParams,
	ensureSearchParams,
	PageGenerateMetadata,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";
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

		const { t } = await loadPageTranslations(
			locale,
			"page-sessions-assistance-password-prompt",
			{ keyPrefix: "content" }
		);

		return (
			<article className={styles.article}>
				<p className={styles.instructions}>
					{t("instructions", { email: query.email })}
				</p>
			</article>
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
