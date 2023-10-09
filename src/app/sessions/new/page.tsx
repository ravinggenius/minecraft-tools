import { Metadata } from "next";
import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { maybeProfileFromSession } from "@/library/_/session";

import { createSession } from "./actions";
import CreateSessionForm from "./form";
import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-sessions-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function SessionsNewPage() {
	const { t } = await loadPageTranslations("page-sessions-new", {
		keyPrefix: "content"
	});

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	return (
		<article className={styles.article}>
			<CreateSessionForm action={createSession} />

			<Anchor href="/profiles/new" variant="secondary">
				{t("sign-up-cta")}
			</Anchor>

			<Anchor href="/sessions/assistance/password/new" variant="inline">
				{t("password-assistance-cta")}
			</Anchor>
		</article>
	);
}
