import { Metadata } from "next";
import { notFound } from "next/navigation";

import ActionButton from "@/components/ActionButton/ActionButton";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as itemColorModel from "@/domains/item-color/model";
import * as itemIdentityModel from "@/domains/item-identity/model";
import * as itemRarityModel from "@/domains/item-rarity/model";
import * as itemStackSizeModel from "@/domains/item-stack-size/model";
import * as itemTranslationKeyModel from "@/domains/item-translation-key/model";
import * as itemModel from "@/domains/item/model";
import { ITEM } from "@/domains/item/schema";
import { loadPageTranslations } from "@/i18n/server";
import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemForm from "../form";

import deleteItemAction from "./_actions/delete-item-action";
import updateItemAction from "./_actions/update-item-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/items/[itemId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-items-show",
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
}: PageProps<"/[locale]/command/items/[itemId]">) {
	const { locale, itemId } = await ensureParams(
		PARAMS.extend({
			itemId: ITEM.shape.id
		}),
		params
	);

	await enforceAuthorization(["update", "any", "item"]);

	const item = await itemModel.get(itemId);

	if (!item) {
		notFound();
	}

	const { t } = await loadPageTranslations(
		locale,
		"page-command-items-show",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "items" },
		{
			label: t("breadcrumb.short-name", {
				...item,
				context: item.isVariant ? "is-variant" : undefined
			}),
			name: "itemId",
			value: itemId
		}
	]);

	const [colors, identities, rarities, stackSizes, translationKeys] =
		await Promise.all([
			itemColorModel.listAll(),
			itemIdentityModel.listAll(),
			itemRarityModel.listAll(),
			itemStackSizeModel.listAll(),
			itemTranslationKeyModel.listAll()
		]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>{t("releases-count", { count: item.releasesCount })}</p>

				<ItemForm
					action={updateItemAction(item.id)}
					attrs={item}
					colors={colors}
					identities={identities}
					rarities={rarities}
					stackSizes={stackSizes}
					translationKeys={translationKeys}
				/>

				{(await confirmAuthorization(["destroy", "any", "item"])) ? (
					<ActionButton
						action={deleteItemAction(itemId)}
						label={t("delete-cta.label")}
						variant="inline"
					/>
				) : null}
			</article>
		</>
	);
}
