import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import PlatformForm from "../form";

import createPlatformAction from "./_actions/create-platform-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/platforms/new">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-platforms-new",
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
}: PageProps<"/[locale]/command/platforms/new">) {
	const { locale } = await ensureParams(PARAMS, params);

	await enforceAuthorization(["create", "new", "platform"]);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-platforms-new",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "platforms" },
		{ name: "new" }
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<PlatformForm
					action={createPlatformAction}
					attrs={{ name: "" }}
				/>
			</article>
		</>
	);
}
