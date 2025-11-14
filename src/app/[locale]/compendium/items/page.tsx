import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { Pagination } from "@/components/Pagination/Pagination";
import SearchForm from "@/components/SearchForm/SearchForm";
import * as itemModel from "@/domains/item/model";
import { FlattenedItem, NormalizedItem } from "@/domains/item/schema";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import {
	ensureParams,
	ensureSearchParams,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import PageSearchResultsFlattened from "../../command/items/search-results-flattened";
import PageSearchResultsNormalized from "../../command/items/search-results-normalized";

import styles from "./page.module.scss";
import { QUERY } from "./schema";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/compendium/items">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-compendium-items", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params,
	searchParams
}: PageProps<"/[locale]/compendium/items">) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "compendium" },
		{ name: "items" }
	]);

	const query = await ensureSearchParams(QUERY, searchParams);

	const items = query.expand
		? await itemModel.searchFlattened(query)
		: await itemModel.searchNormalized(query);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<div className={styles.root}>
				<SearchForm {...{ query }} className={styles.form} />

				{query.expand ? (
					<PageSearchResultsFlattened
						{...{ locale }}
						className={styles.results}
						items={items.data as Array<FlattenedItem>}
						view={query.view}
					/>
				) : (
					<PageSearchResultsNormalized
						{...{ locale }}
						className={styles.results}
						items={items.data as Array<NormalizedItem>}
						view={query.view}
					/>
				)}

				<Pagination
					{...{ locale, query }}
					className={styles.pagination}
					count={items.data.length}
					totalMatchingCount={items.count}
				/>
			</div>
		</>
	);
}
