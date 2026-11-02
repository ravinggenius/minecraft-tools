import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { ItemReleaseAttrs } from "@/domains/item-release/schema";
import * as itemModel from "@/domains/item/model";
import * as releaseModel from "@/domains/release/model";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemReleaseForm from "../form";

import createItemReleaseAction from "./_actions/create-item-release-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-releases/new">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-releases-new",
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
}: PageProps<"/[locale]/command/item-releases/new">) {
	const { locale } = await ensureParams(PARAMS, params);

	await enforceAuthorization(["create", "new", "item-release"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-releases" },
		{ name: "new" }
	]);

	const [items, releases] = await Promise.all([
		itemModel.listAll(),
		releaseModel.listAll()
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<ItemReleaseForm
					action={createItemReleaseAction}
					attrs={{
						releaseId: "" as ItemReleaseAttrs["releaseId"],
						itemId: "" as ItemReleaseAttrs["itemId"]
					}}
					isNew
					items={items}
					releases={releases}
				/>
			</article>
		</>
	);
}
