"use client";

import classNames from "classnames";
import { useState } from "react";

import LogoutForm from "@/app/[locale]/profile/LogoutForm";
import Anchor from "@/components/Anchor/Anchor";
import Button from "@/components/Button/Button";
import NavigationTree from "@/components/NavigationTree/NavigationTree";
import SiteMasthead from "@/components/SiteMasthead/SiteMasthead";
import { Profile } from "@/library/profile/schema";

import { ALL as BASE_RESOURCES } from "./data";
import styles from "./SiteDeck.module.css";

export default function SiteDeck({
	className,
	profile
}: {
	className?: string;
	profile?: Profile | undefined;
}) {
	const [show, setShow] = useState(false);

	return (
		<nav className={classNames(styles.deck, className)}>
			<SiteMasthead
				className={styles.header}
				tagline="NOT official!"
				title="Unofficial Minecraft Tools"
			/>

			<div className={styles.auth}>
				{profile ? (
					<LogoutForm />
				) : (
					<>
						<Anchor href="/profiles/new" variant="secondary">
							sign up
						</Anchor>

						<Anchor href="/sessions/new" variant="inline">
							log in
						</Anchor>
					</>
				)}
			</div>

			<Button
				aria-label={
					show ? "close table of contents" : "open table of contents"
				}
				className={styles.toggle}
				onClick={() => {
					setShow((prev) => !prev);
				}}
				type="button"
				variant="secondary"
			>
				{show ? "close" : "open"}
			</Button>

			<div
				className={styles.wrapper}
				style={{ display: show ? undefined : "none" }}
			>
				<NavigationTree
					branches={BASE_RESOURCES}
					className={styles["tree-root"]}
				/>
			</div>
		</nav>
	);
}
