import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import ItemTranslationKeyForm from "../form";

import createItemTranslationKeyAction from "./_actions/create-item-translation-key-action";
import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-translation-keys/new">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-translation-keys-new",
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
}: PageProps<"/[locale]/command/item-translation-keys/new">) {
	const { locale } = await ensureParams(PARAMS, params);

	await enforceAuthorization(["create", "new", "item-translation-key"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-translation-keys" },
		{ name: "new" }
	]);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<ItemTranslationKeyForm
					action={createItemTranslationKeyAction}
					attrs={{ identifier: "" }}
					isNew
				/>
			</article>
		</>
	);
}
