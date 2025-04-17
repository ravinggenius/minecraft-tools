"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Crumb } from "@/library/breadcrumbs";

import BreadcrumbTrail from "./BreadcrumbTrail";

export const BREADCRUMB_TRAIL_ROOT_ID = "breadcrumb-trail-root";

export default function BreadcrumbTrailPortal({
	className,
	crumbs
}: {
	className?: string;
	crumbs: Array<Crumb>;
}) {
	const [portalRoot, setPortalRoot] = useState<HTMLElement>();

	useEffect(() => {
		const root =
			document.getElementById(BREADCRUMB_TRAIL_ROOT_ID) ?? undefined;

		setPortalRoot(root);
	}, []);

	return portalRoot
		? createPortal(
				<BreadcrumbTrail {...{ className, crumbs }} />,
				portalRoot
			)
		: null;
}
