import classNames from "classnames";

import ActionButton from "@/components/ActionButton/ActionButton";
import Anchor from "@/components/Anchor/Anchor";
import Icon from "@/components/Icon/Icon";
import NavigationTree from "@/components/NavigationTree/NavigationTree";
import SiteMasthead from "@/components/SiteMasthead/SiteMasthead";
import { Profile } from "@/domains/profile/schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { ServerAction } from "@/library/server-action";

import { ALL as BASE_RESOURCES } from "./data";
import styles from "./SiteDeck.module.scss";

export default async function SiteDeck({
	className,
	deleteSessionAction,
	locale,
	profile
}: {
	className?: string;
	deleteSessionAction: ServerAction;
	locale: SupportedLocale;
	profile?: Pick<Profile, "name"> | undefined;
}) {
	const { t } = await loadPageTranslations(locale, "component-site-deck");

	return (
		<nav className={classNames(styles.deck, className)}>
			<SiteMasthead
				{...{ locale }}
				className={styles.header}
				tagline={t("branding.tagline")}
				title={t("branding.title")}
			/>

			<label className={styles.toggle}>
				<input className={styles["toggle-state"]} type="checkbox" />

				<Icon
					aria-label={t("table-of-contents.label", {
						context: "opened"
					})}
					className={styles["toggle-label--opened"]}
					code={"cross"}
				/>

				<Icon
					aria-label={t("table-of-contents.label", {
						context: "closed"
					})}
					className={styles["toggle-label--closed"]}
					code={"box"}
				/>
			</label>

			<div className={styles.wrapper}>
				{profile ? (
					<>
						<Anchor href={`/${locale}/profile`} variant="inline">
							{t("authentication.profile", {
								name: profile.name
							})}
						</Anchor>

						<ActionButton
							action={deleteSessionAction}
							label={t("authentication.log-out-cta")}
						/>
					</>
				) : (
					<>
						<Anchor
							href={`/${locale}/profiles/new`}
							variant="secondary"
						>
							{t("authentication.sign-up-cta")}
						</Anchor>

						<Anchor
							href={`/${locale}/sessions/new`}
							variant="inline"
						>
							{t("authentication.log-in-cta")}
						</Anchor>
					</>
				)}

				<NavigationTree
					{...{ locale }}
					branches={BASE_RESOURCES}
					className={styles["tree-root"]}
				/>
			</div>
		</nav>
	);
}
