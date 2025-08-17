import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as platformModel from "@/domains/platform/model";
import { PLATFORM } from "@/domains/platform/schema";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import PlatformForm from "../form";

import updatePlatformAction from "./_actions/update-platform-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/platforms/[platformId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-platforms-show",
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
}: PageProps<"/[locale]/command/platforms/[platformId]">) {
	const { locale, platformId } = await ensureParams(
		PARAMS.extend({
			platformId: PLATFORM.shape.id
		}),
		params
	);

	await enforceAuthorization(["read", "any", "platform"]);

	const platform = await platformModel.get(platformId);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-platforms-show",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "platforms" },
		{
			label: t("breadcrumb.platform-short-name", platform),
			name: "platformId",
			value: platformId
		}
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<PlatformForm
					action={updatePlatformAction(platform.id)}
					attrs={platform}
				/>
			</article>
		</>
	);
}
