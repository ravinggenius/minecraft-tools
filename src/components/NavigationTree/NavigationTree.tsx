import classNames from "classnames";

import Anchor from "@/components/Anchor/Anchor";
import { Resource } from "@/components/SiteDeck/schemas";

import styles from "./NavigationTree.module.css";

function Branch({ branch }: { branch: Resource }) {
	return (
		<li
			className={styles.branch}
			data-children={Boolean(branch.children?.length)}
		>
			<Anchor className={styles.leaf} href={branch.href} variant="inline">
				{branch.title}
			</Anchor>

			{branch.children?.length ? (
				<NavigationTree branches={branch.children} />
			) : null}
		</li>
	);
}

export default function NavigationTree({
	branches,
	className
}: {
	branches: Array<Resource>;
	className?: string;
}) {
	return (
		<ol className={classNames(styles.tree, className)}>
			{branches.map((branch) => (
				<Branch {...{ branch }} key={branch.title} />
			))}
		</ol>
	);
}
