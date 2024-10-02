import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageGenerateMetadata,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";
import { maybeProfileFromSession } from "@/library/session-manager";

import createSessionAction from "./_actions/create-session-action";
import CreateSessionForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-sessions-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-sessions-new", {
		keyPrefix: "content"
	});

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	return (
		<article className={styles.article}>
			<CreateSessionForm action={createSessionAction} />

			<Anchor href={`/${locale}/profiles/new`} variant="secondary">
				{t("sign-up-cta")}
			</Anchor>

			<Anchor
				href={`/${locale}/sessions/assistance/password/new`}
				variant="inline"
			>
				{t("password-assistance-cta")}
			</Anchor>
		</article>
	);
}
