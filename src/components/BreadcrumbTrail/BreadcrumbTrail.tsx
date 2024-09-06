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
	segmentName: string;
	segmentValue: string;
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
	segmentName,
	segmentValue: _segmentValue
}: Crumb & {
	className?: string;
	child?: NestedCrumb["child"];
	isRoot?: boolean;
}) {
	const { t } = useTranslation("component-breadcrumb-trail");

	const label = t(`segment-labels.${segmentName}`);

	return (
		<ol className={classNames(styles["breadcrumb-list"], className)}>
			<li className={styles["breadcrumb-list-item"]} data-root={isRoot}>
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

const splitPath = (path: string): Array<string> =>
	path.split("/").filter(Boolean);

export default function BreadcrumbTrail({ className }: { className?: string }) {
	const segmentNames = ["locale", ...useSelectedLayoutSegments()];
	const segmentValues = splitPath(usePathname());

	const crumbs = zip(segmentNames, segmentValues).map(
		([segmentName, segmentValue], index) => ({
			href: `/${segmentValues.slice(0, index + 1).join("/")}` as Crumb["href"],
			segmentName: segmentName.replace("[", "").replace("]", ""),
			segmentValue
		})
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
