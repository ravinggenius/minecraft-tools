import { Metadata } from "next";
import { notFound } from "next/navigation";

import ActionButton from "@/components/ActionButton/ActionButton";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as itemTranslationKeyModel from "@/domains/item-translation-key/model";
import { ITEM_TRANSLATION_KEY } from "@/domains/item-translation-key/schema";
import { loadPageTranslations } from "@/i18n/server";
import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemTranslationKeyForm from "../form";

import deleteItemTranslationKeyAction from "./_actions/delete-item-translation-key-action";
import updateItemTranslationKeyAction from "./_actions/update-item-translation-key-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-translation-keys/[itemTranslationKeyId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-translation-keys-show",
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
}: PageProps<"/[locale]/command/item-translation-keys/[itemTranslationKeyId]">) {
	const { locale, itemTranslationKeyId } = await ensureParams(
		PARAMS.extend({
			itemTranslationKeyId: ITEM_TRANSLATION_KEY.shape.id
		}),
		params
	);

	await enforceAuthorization(["update", "any", "item-translation-key"]);

	const itemTranslationKey =
		await itemTranslationKeyModel.get(itemTranslationKeyId);

	if (!itemTranslationKey) {
		notFound();
	}

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-translation-keys-show",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-translation-keys" },
		{
			label: t("breadcrumb.short-name", {
				identifier: itemTranslationKey.identifier
			}),
			name: "itemTranslationKeyId",
			value: itemTranslationKeyId
		}
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>
					{t("usage-count", { count: itemTranslationKey.usageCount })}
				</p>

				<ItemTranslationKeyForm
					action={updateItemTranslationKeyAction(
						itemTranslationKey.id
					)}
					attrs={itemTranslationKey}
				/>

				{(await confirmAuthorization([
					"destroy",
					"any",
					"item-translation-key"
				])) ? (
					<ActionButton
						action={deleteItemTranslationKeyAction(
							itemTranslationKeyId
						)}
						label={t("delete-cta.label")}
						variant="inline"
					/>
				) : null}
			</article>
		</>
	);
}
