"use client";

import classNames from "classnames";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { zip } from "rambda";
import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { useTranslation } from "@/i18n/client";

import styles from "./BreadcrumbTrail.module.scss";

interface Crumb {
	href: ComponentProps<typeof Anchor>["href"];
	label: string;
	name: string;
	value: string;
}

interface NestedCrumb extends Crumb {
	child: Trail;
}

type Trail = Crumb | NestedCrumb;

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

const isPathnameSegment = (name: string) =>
	!name.startsWith("(") && !name.endsWith(")");

const splitPath = (path: string): Array<string> =>
	path.split("/").filter(Boolean);

export default function BreadcrumbTrail({ className }: { className?: string }) {
	const { t } = useTranslation("component-breadcrumb-trail");

	const segmentNames = ["locale", ...useSelectedLayoutSegments()].filter(
		isPathnameSegment
	);
	const segmentValues = splitPath(usePathname());

	const crumbs = zip(segmentNames, segmentValues).map(
		([name, value], index) =>
			({
				href: `/${segmentValues.slice(0, index + 1).join("/")}` as Crumb["href"],
				label: t(`segment-labels.${name}`),
				name: name.replace("[", "").replace("]", ""),
				value
			}) satisfies Crumb as Crumb
	);

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
