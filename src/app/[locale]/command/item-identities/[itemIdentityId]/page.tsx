import { Metadata } from "next";
import { notFound } from "next/navigation";

import ActionButton from "@/components/ActionButton/ActionButton";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import * as itemIdentityModel from "@/domains/item-identity/model";
import { ITEM_IDENTITY } from "@/domains/item-identity/schema";
import { loadPageTranslations } from "@/i18n/server";
import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemIdentityForm from "../form";

import deleteItemIdentityAction from "./_actions/delete-item-identity-action";
import updateItemIdentityAction from "./_actions/update-item-identity-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-identities/[itemIdentityId]">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-identities-show",
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
}: PageProps<"/[locale]/command/item-identities/[itemIdentityId]">) {
	const { locale, itemIdentityId } = await ensureParams(
		PARAMS.extend({
			itemIdentityId: ITEM_IDENTITY.shape.id
		}),
		params
	);

	await enforceAuthorization(["update", "any", "item-identity"]);

	const itemIdentity = await itemIdentityModel.get(itemIdentityId);

	if (!itemIdentity) {
		notFound();
	}

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-identities-show",
		{
			keyPrefix: "content"
		}
	);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-identities" },
		{
			label: t("breadcrumb.short-name", {
				...itemIdentity,
				context: itemIdentity.isVariant ? "is-variant" : undefined
			}),
			name: "itemIdentityId",
			value: itemIdentityId
		}
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>{t("usage-count", { count: itemIdentity.usageCount })}</p>

				<ItemIdentityForm
					action={updateItemIdentityAction(itemIdentity.id)}
					attrs={itemIdentity}
				/>

				{(await confirmAuthorization([
					"destroy",
					"any",
					"item-identity"
				])) ? (
					<ActionButton
						action={deleteItemIdentityAction(itemIdentityId)}
						label={t("delete-cta.label")}
						variant="inline"
					/>
				) : null}
			</article>
		</>
	);
}
