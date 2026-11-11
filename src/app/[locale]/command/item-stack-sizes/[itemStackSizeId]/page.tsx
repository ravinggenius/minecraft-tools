import { Metadata } from "next";
import { notFound } from "next/navigation";

import ActionButton from "@/components/ActionButton/ActionButton";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as itemStackSizeModel from "@/domains/item-stack-size/model";
import { ITEM_STACK_SIZE } from "@/domains/item-stack-size/schema";
import { loadPageTranslations } from "@/i18n/server";
import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemStackSizeForm from "../form";

import deleteItemStackSizeAction from "./_actions/delete-item-stack-size-action";
import updateItemStackSizeAction from "./_actions/update-item-stack-size-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-stack-sizes/[itemStackSizeId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-stack-sizes-show",
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
}: PageProps<"/[locale]/command/item-stack-sizes/[itemStackSizeId]">) {
	const { locale, itemStackSizeId } = await ensureParams(
		PARAMS.extend({
			itemStackSizeId: ITEM_STACK_SIZE.shape.id
		}),
		params
	);

	await enforceAuthorization(["update", "any", "item-stack-size"]);

	const itemStackSize = await itemStackSizeModel.get(itemStackSizeId);

	if (!itemStackSize) {
		notFound();
	}

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-stack-sizes-show",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-stack-sizes" },
		{
			label: t("breadcrumb.short-name", {
				count: itemStackSize.identifier
			}),
			name: "itemStackSizeId",
			value: itemStackSizeId
		}
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>{t("usage-count", { count: itemStackSize.usageCount })}</p>

				<ItemStackSizeForm
					action={updateItemStackSizeAction(itemStackSize.id)}
					attrs={itemStackSize}
				/>

				{(await confirmAuthorization([
					"destroy",
					"any",
					"item-stack-size"
				])) ? (
					<ActionButton
						action={deleteItemStackSizeAction(itemStackSizeId)}
						label={t("delete-cta.label")}
						variant="inline"
					/>
				) : null}
			</article>
		</>
	);
}
