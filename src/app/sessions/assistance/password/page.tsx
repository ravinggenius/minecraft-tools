import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { maybeProfileFromSession } from "@/library/_/session";

import { resetForgottenPassword } from "./actions";
import SessionAssistancePasswordForm from "./form";
import styles from "./page.module.scss";
import { QUERY } from "./schema";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations(
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
	searchParams
}: {
	searchParams: {
		[key: string]: string | Array<string> | undefined;
	};
}) {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	const query = QUERY.safeParse(searchParams);

	if (!query.success) {
		redirect("/sessions/new");
	}

	return (
		<article className={styles.article}>
			<SessionAssistancePasswordForm
				{...query.data}
				action={resetForgottenPassword}
			/>
		</article>
	);
}
