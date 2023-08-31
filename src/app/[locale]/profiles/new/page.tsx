import { Metadata } from "next";
import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import { maybeProfileFromSession } from "@/library/_/session";

import { createProfile } from "./actions";
import CreateProfileForm from "./form";
import styles from "./page.module.css";

export const metadata = {
	title: "Create Profile"
} satisfies Metadata;

export default async function ProfilesNewPage() {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	return (
		<main className={styles.main}>
			<CreateProfileForm action={createProfile} />

			<Anchor href="/sessions/new" variant="secondary">
				Sign In
			</Anchor>
		</main>
	);
}
