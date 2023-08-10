import classNames from "classnames";
import { useState } from "react";

import Anchor from "@/components/Anchor/Anchor";
import Button from "@/components/Button/Button";
import { Resource } from "@/components/TableOfContents/schemas";

import styles from "./NavigationTree.module.css";

export function Branch({ branch }: { branch: Resource }) {
	const [showChildren, setShowChildren] = useState(false);

	return (
		<li
			className={styles.branch}
			data-children={Boolean(branch.children?.length)}
		>
			{branch.children?.length ? (
				<Button
					className={styles.toggle}
					onClick={() => setShowChildren((prev) => !prev)}
					type="button"
					variant="inline"
				>
					{showChildren ? "-" : "+"}
				</Button>
			) : null}

			<Anchor className={styles.leaf} href={branch.href} variant="inline">
				{branch.title}
			</Anchor>

			{branch.children?.length ? (
				<NavigationTree
					branches={branch.children}
					open={showChildren}
				/>
			) : null}
		</li>
	);
}

export default function NavigationTree({
	branches,
	className,
	open = false
}: {
	branches: Array<Resource>;
	className?: string;
	open?: boolean;
}) {
	return (
		<ol className={classNames(styles.tree, className)} data-open={open}>
			{branches.map((branch) => (
				<Branch {...{ branch }} key={branch.title} />
			))}
		</ol>
	);
}
