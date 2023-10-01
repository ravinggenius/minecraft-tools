"use client";

import classNames from "classnames";
import { useState } from "react";

import LogoutForm from "@/app/profile/LogoutForm";
import Anchor from "@/components/Anchor/Anchor";
import Button from "@/components/Button/Button";
import NavigationTree from "@/components/NavigationTree/NavigationTree";
import SiteMasthead from "@/components/SiteMasthead/SiteMasthead";
import { useTranslation } from "@/i18n/client";
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
	const { t } = useTranslation("component-site-deck");

	const [show, setShow] = useState(false);

	return (
		<nav className={classNames(styles.deck, className)}>
			<SiteMasthead
				className={styles.header}
				tagline={t("branding.tagline")}
				title={t("branding.title")}
			/>

			<div className={styles.auth}>
				{profile ? (
					<>
						<Anchor href="/profile" variant="inline">
							{t("authentication.profile", {
								name: profile.name
							})}
						</Anchor>

						<LogoutForm />
					</>
				) : (
					<>
						<Anchor href="/profiles/new" variant="secondary">
							{t("authentication.sign-up-cta")}
						</Anchor>

						<Anchor href="/sessions/new" variant="inline">
							{t("authentication.log-in-cta")}
						</Anchor>
					</>
				)}
			</div>

			<Button
				aria-label={t("table-of-contents.label", {
					context: show ? "opened" : "closed"
				})}
				className={styles.toggle}
				onClick={() => {
					setShow((prev) => !prev);
				}}
				type="button"
				variant="secondary"
			>
				{t("table-of-contents.toggle", {
					context: show ? "opened" : "closed"
				})}
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
