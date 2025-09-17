import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ReleaseCycleForm from "../form";

import createReleaseCycleAction from "./_actions/create-release-cycle-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/release-cycles/new">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-release-cycles-new",
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
}: PageProps<"/[locale]/command/release-cycles/new">) {
	const { locale } = await ensureParams(PARAMS, params);

	await enforceAuthorization(["create", "new", "release-cycle"]);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-release-cycles-new",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "release-cycles" },
		{ name: "new" }
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<ReleaseCycleForm
					action={createReleaseCycleAction}
					attrs={{ name: "" }}
				/>
			</article>
		</>
	);
}
