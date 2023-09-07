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
	authentication,
	branding,
	className,
	profile
}: {
	authentication: {
		signUpCta: string;
		logInCta: string;
	};
	branding: {
		tagline: string;
		title: string;
	};
	className?: string;
	profile?: Profile | undefined;
}) {
	const { t } = useTranslation("component-site-deck");

	const [show, setShow] = useState(false);

	return (
		<nav className={classNames(styles.deck, className)}>
			<SiteMasthead {...branding} className={styles.header} />

			<div className={styles.auth}>
				{profile ? (
					<LogoutForm />
				) : (
					<>
						<Anchor href="/profiles/new" variant="secondary">
							{authentication.signUpCta}
						</Anchor>

						<Anchor href="/sessions/new" variant="inline">
							{authentication.logInCta}
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
