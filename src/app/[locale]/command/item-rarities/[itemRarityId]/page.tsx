import { Metadata } from "next";
import { notFound } from "next/navigation";

import ActionButton from "@/components/ActionButton/ActionButton";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as itemRarityModel from "@/domains/item-rarity/model";
import { ITEM_RARITY } from "@/domains/item-rarity/schema";
import { loadPageTranslations } from "@/i18n/server";
import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemRarityForm from "../form";

import deleteItemRarityAction from "./_actions/delete-item-rarity-action";
import updateItemRarityAction from "./_actions/update-item-rarity-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-rarities/[itemRarityId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-rarities-show",
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
}: PageProps<"/[locale]/command/item-rarities/[itemRarityId]">) {
	const { locale, itemRarityId } = await ensureParams(
		PARAMS.extend({
			itemRarityId: ITEM_RARITY.shape.id
		}),
		params
	);

	await enforceAuthorization(["update", "any", "item-rarity"]);

	const itemRarity = await itemRarityModel.get(itemRarityId);

	if (!itemRarity) {
		notFound();
	}

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-rarities-show",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-rarities" },
		{
			label: t("breadcrumb.short-name", {
				identifier: itemRarity.identifier
			}),
			name: "itemRarityId",
			value: itemRarityId
		}
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>{t("usage-count", { count: itemRarity.usageCount })}</p>

				<ItemRarityForm
					action={updateItemRarityAction(itemRarity.id)}
					attrs={itemRarity}
				/>

				{(await confirmAuthorization([
					"destroy",
					"any",
					"item-rarity"
				])) ? (
					<ActionButton
						action={deleteItemRarityAction(itemRarityId)}
						label={t("delete-cta.label")}
						variant="inline"
					/>
				) : null}
			</article>
		</>
	);
}
