import { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireVerifiedProfile } from "@/library/_/session";

import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Profile"
};

export default async function Profile() {
	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		redirect("/profile/welcome");
	}

	return (
		<main className={styles.main}>
			<p>your profile page!</p>
		</main>
	);
}
