import { Metadata } from "next";
import { notFound } from "next/navigation";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as releaseCycleModel from "@/domains/release-cycle/model";
import { RELEASE_CYCLE } from "@/domains/release-cycle/schema";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ReleaseCycleForm from "../form";

import updateReleaseCycleAction from "./_actions/update-release-cycle-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/release-cycles/[releaseCycleId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-release-cycles-show",
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
}: PageProps<"/[locale]/command/release-cycles/[releaseCycleId]">) {
	const { locale, releaseCycleId } = await ensureParams(
		PARAMS.extend({
			releaseCycleId: RELEASE_CYCLE.shape.id
		}),
		params
	);

	await enforceAuthorization(["read", "any", "release-cycle"]);

	const releaseCycle = await releaseCycleModel.get(releaseCycleId);

	if (!releaseCycle) {
		notFound();
	}

	const { t } = await loadPageTranslations(
		locale,
		"page-command-release-cycles-show",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "release-cycles" },
		{
			label: t("breadcrumb.short-name", releaseCycle),
			name: "releaseCycleId",
			value: releaseCycleId
		}
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<ReleaseCycleForm
					action={updateReleaseCycleAction(releaseCycle.id)}
					attrs={releaseCycle}
				/>
			</article>
		</>
	);
}
