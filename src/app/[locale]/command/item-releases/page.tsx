import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { Pagination } from "@/components/Pagination/Pagination";
import SearchForm from "@/components/SearchForm/SearchForm";
import * as itemReleaseModel from "@/domains/item-release/model";
import {
	FlattenedItemRelease,
	NormalizedItemRelease
} from "@/domains/item-release/schema";
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
import PageSearchResultsFlattened from "./search-results-flattened";
import PageSearchResultsNormalized from "./search-results-normalized";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/item-releases">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-releases",
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
}: PageProps<"/[locale]/command/item-releases">) {
	const { locale } = await ensureParams(PARAMS, params);

	const query = await ensureSearchParams(QUERY, searchParams);

	await enforceAuthorization(["read", "any", "item-release"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "item-releases" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-item-releases",
		{
			keyPrefix: "content"
		}
	);

	const itemReleases = query.expand
		? await itemReleaseModel.searchFlattened(query)
		: await itemReleaseModel.searchNormalized(query);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>{t("description")}</p>

				<SearchForm {...{ query }} className={styles.form} />

				{query.expand ? (
					<PageSearchResultsFlattened
						{...{ locale }}
						className={styles.results}
						itemReleases={
							itemReleases.data as Array<FlattenedItemRelease>
						}
						view={query.view}
					/>
				) : (
					<PageSearchResultsNormalized
						{...{ locale }}
						className={styles.results}
						itemReleases={
							itemReleases.data as Array<NormalizedItemRelease>
						}
						view={query.view}
					/>
				)}

				<Pagination
					{...{ locale, query }}
					className={styles.pagination}
					count={itemReleases.data.length}
					totalMatchingCount={itemReleases.count}
				/>
			</article>
		</>
	);
}
