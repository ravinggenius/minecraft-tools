"use client";

import classNames from "classnames";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { zip } from "rambda";

import Anchor from "@/components/Anchor/Anchor";
import { useTranslation } from "@/i18n/client";

import styles from "./BreadcrumbTrail.module.css";

interface Crumb {
	href: string;
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
					<span className={styles["leaf-label"]}>{label}</span>
				)}

				{child ? <BreadcrumbSegment {...child} /> : null}
			</li>
		</ol>
	);
}

const splitPath = (path: string): Array<string> =>
	path.split("/").filter(Boolean);

const buildBreadcrumbTrail = (
	segmentNames: Array<string>,
	segmentValues: Array<string>
): Trail =>
	[["home", ""], ...zip(segmentNames, segmentValues)]
		.map(([segmentName, segmentValue], index) => ({
			href: `/${segmentValues.slice(0, index + 1).join("/")}`,
			segmentName: segmentName.replace("[", "").replace("]", ""),
			segmentValue
		}))
		.reduceRight((memo, crumb) => ({
			child: memo,
			...crumb
		}));

export default function BreadcrumbTrail({ className }: { className?: string }) {
	const pathname = usePathname();
	const segments = useSelectedLayoutSegments();

	return (
		<nav className={classNames(styles["breadcrumb-trail"], className)}>
			<BreadcrumbSegment
				{...buildBreadcrumbTrail(segments, splitPath(pathname))}
				isRoot
			/>
		</nav>
	);
}
