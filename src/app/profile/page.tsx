import { Metadata } from "next";

import { requireVerifiedProfile } from "@/library/_/session";

import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Profile"
};

export default async function Profile() {
	const profile = await requireVerifiedProfile();

	return (
		<main className={styles.main}>
			<p>your profile page!</p>

			<pre>{JSON.stringify(profile, null, 2)}</pre>
		</main>
	);
}
