import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ComponentProps } from "react";

import { CommonPageProps } from "@/app/common-page-props";
import { loadPageTranslations } from "@/app/i18n/server";
import Anchor from "@/components/Anchor/Anchor";
import { maybeProfileFromSession } from "@/library/_/session";

import { createProfile } from "./actions";
import CreateProfileForm from "./form";
import styles from "./page.module.css";

export const generateMetadata = async ({
	params: { locale }
}: ComponentProps<typeof ProfilesNewPage>) => {
	const { t } = await loadPageTranslations(locale, "page-profiles-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata;
};

export default async function ProfilesNewPage({
	params: { locale }
}: CommonPageProps) {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	const { t } = await loadPageTranslations(locale, "page-profiles-new", {
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
