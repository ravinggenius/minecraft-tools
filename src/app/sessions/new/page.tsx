import { Metadata } from "next";
import { redirect } from "next/navigation";

import Anchor from "@/components/Anchor/Anchor";
import { maybeProfileFromSession } from "@/library/_/session";

import { createSession } from "./actions";
import CreateSessionForm from "./form";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Create Session"
};

export default async function SessionsNew() {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	return (
		<main className={styles.main}>
			<CreateSessionForm action={createSession} />

			<Anchor href="/profiles/new" variant="secondary">
				Create Profile
			</Anchor>
		</main>
	);
}
