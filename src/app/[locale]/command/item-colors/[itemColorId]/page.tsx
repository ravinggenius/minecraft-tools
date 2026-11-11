import { Metadata } from "next";
import { notFound } from "next/navigation";

import ActionButton from "@/components/ActionButton/ActionButton";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as itemColorModel from "@/domains/item-color/model";
import { ITEM_COLOR } from "@/domains/item-color/schema";
import { loadPageTranslations } from "@/i18n/server";
import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemColorForm from "../form";

import deleteItemColorAction from "./_actions/delete-item-color-action";
import updateItemColorAction from "./_actions/update-item-color-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-colors/[itemColorId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-colors-show",
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
}: PageProps<"/[locale]/command/item-colors/[itemColorId]">) {
	const { locale, itemColorId } = await ensureParams(
		PARAMS.extend({
			itemColorId: ITEM_COLOR.shape.id
		}),
		params
	);

	await enforceAuthorization(["update", "any", "item-color"]);

	const itemColor = await itemColorModel.get(itemColorId);

	if (!itemColor) {
		notFound();
	}

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-colors-show",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-colors" },
		{
			label: t("breadcrumb.short-name", {
				identifier: itemColor.identifier
			}),
			name: "itemColorId",
			value: itemColorId
		}
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>{t("usage-count", { count: itemColor.usageCount })}</p>

				<ItemColorForm
					action={updateItemColorAction(itemColor.id)}
					attrs={itemColor}
				/>

				{(await confirmAuthorization([
					"destroy",
					"any",
					"item-color"
				])) ? (
					<ActionButton
						action={deleteItemColorAction(itemColorId)}
						label={t("delete-cta.label")}
						variant="inline"
					/>
				) : null}
			</article>
		</>
	);
}
