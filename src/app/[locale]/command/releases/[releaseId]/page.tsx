import { notFound } from "next/navigation";

import ActionButton from "@/components/ActionButton/ActionButton";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as platformModel from "@/domains/platform/model";
import * as releaseCycleModel from "@/domains/release-cycle/model";
import * as releaseModel from "@/domains/release/model";
import { RELEASE } from "@/domains/release/schema";
import { loadPageTranslations } from "@/i18n/server";
import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ReleaseForm from "../form";

import deleteRelease from "./_actions/delete-release-action";
import updateRelease from "./_actions/update-release-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/releases/[releaseId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-releases-show",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	};
};

export default async function Page({
	params
}: PageProps<"/[locale]/command/releases/[releaseId]">) {
	const { locale, releaseId } = await ensureParams(
		PARAMS.extend({
			releaseId: RELEASE.shape.id
		}),
		params
	);

	await enforceAuthorization(["update", "any", "release"]);

	const release = await releaseModel.get(releaseId);

	if (!release) {
		notFound();
	}

	const { t } = await loadPageTranslations(
		locale,
		["domains", "page-command-releases-show"],
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "releases" },
		{
			label: t("breadcrumb.release-short-name", release),
			name: "releaseId",
			value: releaseId
		}
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.main}>
				<ReleaseForm
					action={updateRelease(releaseId)}
					attrs={{
						...release,
						cycle: {
							id: release.cycle?.id
						}
					}}
					cycles={await releaseCycleModel.listAll()}
					platforms={await platformModel.listAll()}
				/>

				{(await confirmAuthorization(["destroy", "any", "release"])) ? (
					<ActionButton
						action={deleteRelease(releaseId)}
						label={t("delete-cta.label")}
						variant="inline"
					/>
				) : null}
			</article>
		</>
	);
}
