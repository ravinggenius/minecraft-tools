import { Metadata } from "next";
import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { maybeProfileFromSession } from "@/library/_/session-manager";

import { createProfile } from "./actions";
import CreateProfileForm from "./form";
import styles from "./page.module.scss";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-profiles-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function ProfilesNewPage() {
	const { t } = await loadPageTranslations("page-profiles-new", {
		keyPrefix: "content"
	});

	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	return (
		<main className={styles.main}>
			<CreateProfileForm action={createProfile} />

			<Anchor href="/sessions/new" variant="secondary">
				{t("log-in-cta")}
			</Anchor>
		</main>
	);
}
