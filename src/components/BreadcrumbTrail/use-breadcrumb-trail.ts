import { useParams, usePathname } from "next/navigation";
import { zip } from "rambda";
import { ComponentProps } from "react";

import { useTranslation } from "@/i18n/client";

import Anchor from "../Anchor/Anchor";

export interface Crumb {
	href: ComponentProps<typeof Anchor>["href"];
	label: string;
	name: string;
	value: string;
}

export interface NestedCrumb extends Crumb {
	child: Crumb | NestedCrumb;
}

const splitPath = (path: string) => path.split("/").filter(Boolean);

const useBreadcrumbTrail = () => {
	const { t } = useTranslation("component-breadcrumb-trail");

	const pathname = usePathname();

	const segmentNames = splitPath(
		Object.entries(useParams() as Record<string, string>).reduce(
			(path, [paramName, paramValue]) =>
				path.replace(paramValue, paramName),
			pathname
		)
	);

	const segmentValues = splitPath(pathname);

	return zip(segmentNames, segmentValues).map(
		([name, value], index) =>
			({
				href: `/${segmentValues.slice(0, index + 1).join("/")}` as Crumb["href"],
				label: t(`segment-labels.${name}`),
				name: name.replace("[", "").replace("]", ""),
				value
			}) satisfies Crumb as Crumb
	);
};

export default useBreadcrumbTrail;
