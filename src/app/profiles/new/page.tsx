import { Metadata } from "next";
import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { maybeProfileFromSession } from "@/library/_/session";

import { createProfile } from "./actions";
import CreateProfileForm from "./form";
import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-profiles-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata;
};

export default async function ProfilesNewPage() {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	const { t } = await loadPageTranslations("page-profiles-new", {
		keyPrefix: "content"
	});

	return (
		<main className={styles.main}>
			<CreateProfileForm action={createProfile} />

			<Anchor href="/sessions/new" variant="secondary">
				{t("submit")}
			</Anchor>
		</main>
	);
}
