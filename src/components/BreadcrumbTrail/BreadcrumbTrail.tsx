"use client";

import classNames from "classnames";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { zip } from "rambda";
import { ComponentProps, ReactNode, useEffect, useState } from "react";

import { useTranslation } from "@/app/i18n/client";
import Anchor from "@/components/Anchor/Anchor";
// import { getLabel as getWaypointLabel } from "@/library/_legacy/waypoint/schemas";
// import { getLabel as getWorldLabel } from "@/library/_legacy/world/schemas";

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

// ...

function BreadcrumbListItem({
	children,
	className,
	isRoot = false
}: {
	children: ReactNode;
	className?: string;
	isRoot?: boolean;
}) {
	return (
		<li
			className={classNames(styles["breadcrumb-list-item"], className)}
			data-root={isRoot}
		>
			{children}
		</li>
	);
}

function BreadcrumbLeaf({
	child,
	className,
	href,
	isRoot = false,
	segmentName,
	segmentValue
}: Crumb & {
	className?: string;
	child?: NestedCrumb["child"];
	isRoot?: ComponentProps<typeof BreadcrumbListItem>["isRoot"];
}) {
	const { t } = useTranslation("component-breadcrumb-trail");

	const staticLabel: string | undefined = t(`segment-labels.${segmentName}`);

	const [label, setLabel] = useState(staticLabel ?? segmentName);

	useEffect(() => {
		const getLabel = {
			// waypointId: getWaypointLabel,
			// worldId: getWorldLabel
		}[segmentName];

		if (getLabel) {
			// getLabel(segmentValue).then(setLabel, () => null);
		}
	}, [segmentName, segmentValue]);

	return (
		<BreadcrumbListItem {...{ className, isRoot }}>
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

			{child ? <BreadcrumbBranch trail={child} /> : null}
		</BreadcrumbListItem>
	);
}

// ...

function BreadcrumbList({
	children,
	className,
	isRoot = false
}: {
	children: ReactNode;
	className?: string;
	isRoot?: boolean;
}) {
	return (
		<ol className={classNames(styles["breadcrumb-list"], className)}>
			{children}
		</ol>
	);
}

function BreadcrumbBranch({
	className,
	isRoot = false,
	trail
}: {
	className?: string;
	isRoot?: ComponentProps<typeof BreadcrumbList>["isRoot"];
	trail: Trail;
}) {
	return (
		<BreadcrumbList {...{ className, isRoot }}>
			<BreadcrumbLeaf {...{ isRoot }} {...trail} />
		</BreadcrumbList>
	);
}

// ...

const splitPath = (path: string): Array<string> =>
	path.split("/").filter(Boolean);

const buildBreadcrumbTrail = (
	segmentNames: Array<string>,
	segmentValues: Array<string>
): Trail => {
	const crumbs: Array<Crumb> = [
		["home", ""],
		...zip(segmentNames, segmentValues)
	].map(([segmentName, segmentValue], index) => ({
		href: `/${segmentValues.slice(0, index).join("/")}`,
		segmentName: segmentName.replace("[", "").replace("]", ""),
		segmentValue
	}));

	return crumbs.reduceRight((memo, crumb) => ({
		child: memo,
		...crumb
	}));
};

export default function BreadcrumbTrail({ className }: { className?: string }) {
	const pathname = usePathname();
	const segments = useSelectedLayoutSegments();

	return (
		<nav className={classNames(styles["breadcrumb-trail"], className)}>
			<BreadcrumbBranch
				isRoot
				trail={buildBreadcrumbTrail(segments, splitPath(pathname))}
			/>
		</nav>
	);
}
