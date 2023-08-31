import { Metadata } from "next";

import { requireVerifiedProfile } from "@/library/_/session";
import * as profileModel from "@/library/profile/model";

import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Welcome"
};

export default async function Welcome() {
	const profile = await requireVerifiedProfile();

	if (profile.isWelcomeNeeded) {
		await profileModel.markAsWelcomed(profile.id);
	}

	return (
		<main className={styles.main}>
			<p>Welcome {profile.name}!</p>
		</main>
	);
}
