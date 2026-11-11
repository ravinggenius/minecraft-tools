import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as itemColorModel from "@/domains/item-color/model";
import * as itemIdentityModel from "@/domains/item-identity/model";
import * as itemRarityModel from "@/domains/item-rarity/model";
import * as itemStackSizeModel from "@/domains/item-stack-size/model";
import * as itemTranslationKeyModel from "@/domains/item-translation-key/model";
import { ItemAttrs } from "@/domains/item/schema";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemForm from "../form";

import createItemAction from "./_actions/create-item-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/items/new">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-command-items-new", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/command/items/new">) {
	const { locale } = await ensureParams(PARAMS, params);

	await enforceAuthorization(["create", "new", "item"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "items" },
		{ name: "new" }
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
				<ItemForm
					action={createItemAction}
					attrs={{
						itemIdentityId: "" as ItemAttrs["itemIdentityId"],
						itemColorId: undefined,
						itemRarityId: "" as ItemAttrs["itemRarityId"],
						itemStackSizeId: "" as ItemAttrs["itemStackSizeId"],
						itemTranslationKeyId: undefined
					}}
					colors={colors}
					identities={identities}
					isNew
					rarities={rarities}
					stackSizes={stackSizes}
					translationKeys={translationKeys}
				/>
			</article>
		</>
	);
}
