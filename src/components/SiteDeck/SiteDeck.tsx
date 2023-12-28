"use client";

import classNames from "classnames";
import { useState } from "react";

import { deleteSession } from "@/app/profile/actions";
import ActionButton from "@/components/ActionButton/ActionButton";
import Anchor from "@/components/Anchor/Anchor";
import Button from "@/components/Button/Button";
import Icon from "@/components/Icon/Icon";
import NavigationTree from "@/components/NavigationTree/NavigationTree";
import SiteMasthead from "@/components/SiteMasthead/SiteMasthead";
import { useTranslation } from "@/i18n/client";
import { Profile } from "@/library/profile/schema";

import { ALL as BASE_RESOURCES } from "./data";
import styles from "./SiteDeck.module.scss";

export default function SiteDeck({
	className,
	profile
}: {
	className?: string;
	profile?: Pick<Profile, "name"> | undefined;
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

			<Button
				aria-label={t("table-of-contents.label", {
					context: show ? "opened" : "closed"
				})}
				className={styles.toggle}
				onClick={() => {
					setShow((prev) => !prev);
				}}
				type="button"
				variant="inline"
			>
				<Icon code={show ? "cross" : "box"} />
			</Button>

			<div
				className={styles.wrapper}
				style={{ display: show ? undefined : "none" }}
			>
				{profile ? (
					<>
						<Anchor href="/profile" variant="inline">
							{t("authentication.profile", {
								name: profile.name
							})}
						</Anchor>

						<ActionButton
							action={deleteSession}
							label={t("authentication.log-out-cta")}
						/>
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

				<NavigationTree
					branches={BASE_RESOURCES}
					className={styles["tree-root"]}
				/>
			</div>
		</nav>
	);
}
