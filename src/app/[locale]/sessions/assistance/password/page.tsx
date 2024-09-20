import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import {
	ensureParams,
	ensureSearchParams,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";
import { maybeProfileFromSession } from "@/library/session-manager";

import resetForgottenPasswordAction from "./_actions/reset-forgotten-password-action";
import SessionAssistancePasswordForm from "./form";
import styles from "./page.module.scss";
import { QUERY } from "./schema";

export const generateMetadata = async ({ params }: PageProps) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-sessions-assistance-password",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function SessionAssistancePasswordPage({
	params,
	searchParams
}: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	try {
		const query = await ensureSearchParams(QUERY, searchParams);

		return (
			<article className={styles.article}>
				<SessionAssistancePasswordForm
					{...query}
					action={resetForgottenPasswordAction}
				/>
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
