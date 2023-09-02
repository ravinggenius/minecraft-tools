import { Metadata } from "next";

import styles from "./page.module.css";

export const metadata = {
	title: "About"
} satisfies Metadata;

export default function AboutPage() {
	return (
		<div className={styles.description}>
			<p>
				Notepads and other tools to keep information about your worlds
				organized. Track your world&apos;s metadata and waypoints.
				Quickly filter structured data about many aspects (potential
				villager trades, loot tables, mob drops et cetera) of the game.
				Data is tagged with edition and version, so you can always find
				relevent information.
			</p>
		</div>
	);
}
