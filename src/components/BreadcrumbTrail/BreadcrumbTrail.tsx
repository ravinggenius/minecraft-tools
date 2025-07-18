import classNames from "classnames";

import Anchor from "@/components/Anchor/Anchor";
import { Crumb, NestedCrumb } from "@/library/breadcrumbs";

import styles from "./BreadcrumbTrail.module.scss";

function BreadcrumbSegment({
	child,
	className,
	href,
	isRoot = false,
	label,
	name,
	value: _value
}: Crumb & {
	className?: string;
	child?: NestedCrumb["child"];
	isRoot?: boolean;
}) {
	return (
		<ol className={classNames(styles["breadcrumb-list"], className)}>
			<li
				className={styles["breadcrumb-list-item"]}
				data-name={name}
				data-root={isRoot}
			>
				{child ? (
					<Anchor
						{...{ href }}
						className={styles["leaf-label"]}
						variant="inline"
					>
						{label}
					</Anchor>
				) : (
					<span className={styles["leaf-label-terminal"]}>
						{label}
					</span>
				)}

				{child ? <BreadcrumbSegment {...child} /> : null}
			</li>
		</ol>
	);
}

export default function BreadcrumbTrail({
	className,
	crumbs
}: {
	className?: string;
	crumbs: Array<Crumb>;
}) {
	if (crumbs.length < 1) {
		return null;
	}

	const nestedCrumbs = crumbs.reduceRight((memo, crumb) => ({
		child: memo,
		...crumb
	}));

	return (
		<nav className={classNames(styles["breadcrumb-trail"], className)}>
			<BreadcrumbSegment {...nestedCrumbs} isRoot />
		</nav>
	);
}
