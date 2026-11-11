import { Metadata } from "next";

import Anchor from "@/components/Anchor/Anchor";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { Pagination } from "@/components/Pagination/Pagination";
import SearchForm from "@/components/SearchForm/SearchForm";
import * as itemTranslationKeyModel from "@/domains/item-translation-key/model";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import {
	ensureParams,
	ensureSearchParams,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";
import { QUERY } from "./schema";
import PageSearchResults from "./search-results";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-translation-keys">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-translation-keys",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params,
	searchParams
}: PageProps<"/[locale]/command/item-translation-keys">) {
	const { locale } = await ensureParams(PARAMS, params);

	const query = await ensureSearchParams(QUERY, searchParams);

	await enforceAuthorization(["read", "any", "item-translation-key"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-translation-keys" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-translation-keys",
		{
			keyPrefix: "content"
		}
	);

	const itemTranslationKeys = await itemTranslationKeyModel.search(query);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>{t("description")}</p>

				<Anchor
					href={`/${locale}/command/item-translation-keys/new`}
					variant="primary"
				>
					{t("new-cta")}
				</Anchor>

				<SearchForm {...{ query }} className={styles.form} hideExpand />

				<PageSearchResults
					{...{ locale }}
					className={styles.results}
					itemTranslationKeys={itemTranslationKeys.data}
					view={query.view}
				/>

				<Pagination
					{...{ locale, query }}
					className={styles.pagination}
					count={itemTranslationKeys.data.length}
					totalMatchingCount={itemTranslationKeys.count}
				/>
			</article>
		</>
	);
}
