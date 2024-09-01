import classNames from "classnames";
import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Resource } from "@/components/SiteDeck/schemas";
import { SupportedLocale } from "@/i18n/settings";

import styles from "./NavigationTree.module.scss";

function Branch({
	branch,
	locale
}: {
	branch: Resource;
	locale: SupportedLocale;
}) {
	return (
		<li
			className={styles.branch}
			data-children={Boolean(branch.children?.length)}
		>
			<Anchor
				className={styles.leaf}
				href={
					branch.href({ locale }) as ComponentProps<
						typeof Anchor
					>["href"]
				}
				variant="inline"
			>
				{branch.title}
			</Anchor>

			{branch.children?.length ? (
				<NavigationTree {...{ locale }} branches={branch.children} />
			) : null}
		</li>
	);
}

export default function NavigationTree({
	branches,
	className,
	locale
}: {
	branches: Array<Resource>;
	className?: string;
	locale: SupportedLocale;
}) {
	return (
		<ol className={classNames(styles.tree, className)}>
			{branches.map((branch) => (
				<Branch {...{ branch, locale }} key={branch.title} />
			))}
		</ol>
	);
}
