import { Metadata } from "next";
import { redirect } from "next/navigation";

import { loadPageTranslations } from "@/i18n/server";
import { maybeProfileFromSession } from "@/library/_/session";

import styles from "./page.module.scss";
import { QUERY } from "./schema";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations(
		"page-sessions-assistance-password-prompt",
		{ keyPrefix: "metadata" }
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function SessionsForgotPasswordPrompt({
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

	const { t } = await loadPageTranslations(
		"page-sessions-assistance-password-prompt",
		{ keyPrefix: "content" }
	);

	return (
		<article className={styles.article}>
			<p className={styles.instructions}>
				{t("instructions", { email: query.data.email })}
			</p>
		</article>
	);
}
