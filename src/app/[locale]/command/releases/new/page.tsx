import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as platformModel from "@/domains/platform/model";
import * as releaseModel from "@/domains/release/model";
import { ReleaseAttrs } from "@/domains/release/schema";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ReleaseForm from "../form";

import createRelease from "./_actions/create-release-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/releases/new">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-releases-new",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/command/releases/new">) {
	const { locale } = await ensureParams(PARAMS, params);

	await enforceAuthorization(["create", "new", "release"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "releases" },
		{ name: "new" }
	]);

	const mostRecentName = await releaseModel.mostRecentName();

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.main}>
				<ReleaseForm
					action={createRelease}
					attrs={{
						edition: "" as ReleaseAttrs["edition"],
						version: "",
						name: mostRecentName ?? "",
						developmentReleasedOn: undefined,
						changelog: "",
						isAvailableForTools: false,
						platforms: []
					}}
					isNew
					platforms={await platformModel.listAll()}
				/>
			</article>
		</>
	);
}
