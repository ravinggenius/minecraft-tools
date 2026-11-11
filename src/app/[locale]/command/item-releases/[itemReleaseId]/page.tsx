import { Metadata } from "next";
import { notFound } from "next/navigation";

import ActionButton from "@/components/ActionButton/ActionButton";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as itemReleaseModel from "@/domains/item-release/model";
import { ITEM_RELEASE } from "@/domains/item-release/schema";
import * as itemModel from "@/domains/item/model";
import * as releaseModel from "@/domains/release/model";
import { loadPageTranslations } from "@/i18n/server";
import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemReleaseForm from "../form";

import deleteItemReleaseAction from "./_actions/delete-item-release-action";
import updateItemReleaseAction from "./_actions/update-item-release-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-releases/[itemReleaseId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-releases-show",
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
}: PageProps<"/[locale]/command/item-releases/[itemReleaseId]">) {
	const { locale, itemReleaseId } = await ensureParams(
		PARAMS.extend({
			itemReleaseId: ITEM_RELEASE.shape.id
		}),
		params
	);

	await enforceAuthorization(["update", "any", "item-release"]);

	const itemRelease = await itemReleaseModel.get(itemReleaseId);

	if (!itemRelease) {
		notFound();
	}

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-releases-show",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-releases" },
		{
			label: t("breadcrumb.short-name", {
				...itemRelease,
				context: itemRelease.isVariant ? "is-variant" : undefined
			}),
			name: "itemReleaseId",
			value: itemReleaseId
		}
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
					action={updateItemReleaseAction(itemRelease.id)}
					attrs={{
						releaseId: itemRelease.releaseId,
						itemId: itemRelease.itemId
					}}
					items={items}
					releases={releases}
				/>

				{(await confirmAuthorization([
					"destroy",
					"any",
					"item-release"
				])) ? (
					<ActionButton
						action={deleteItemReleaseAction(itemReleaseId)}
						label={t("delete-cta.label")}
						variant="inline"
					/>
				) : null}
			</article>
		</>
	);
}
