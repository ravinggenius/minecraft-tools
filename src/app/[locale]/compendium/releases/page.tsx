import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { Pagination } from "@/components/Pagination/Pagination";
import SearchForm from "@/components/SearchForm/SearchForm";
import * as releaseModel from "@/domains/release/model";
import { Release, SpecificRelease } from "@/domains/release/schema";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import {
	ensureParams,
	ensureSearchParams,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";
import { QUERY } from "./schema";
import PageSearchResults from "./search-results";
import PageSearchResultsExpanded from "./search-results-expanded";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/compendium/releases">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-compendium-releases",
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
}: PageProps<"/[locale]/compendium/releases">) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "compendium" },
		{ name: "releases" }
	]);

	const query = await ensureSearchParams(QUERY, searchParams);

	const releases = query.expand
		? await releaseModel.searchExpanded(query)
		: await releaseModel.search(query);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<div className={styles.root}>
				<SearchForm {...{ query }} className={styles.form} />

				{query.expand ? (
					<PageSearchResultsExpanded
						{...{ locale }}
						className={styles.results}
						releases={releases.data as Array<SpecificRelease>}
						view={query.view}
					/>
				) : (
					<PageSearchResults
						{...{ locale }}
						className={styles.results}
						releases={releases.data as Array<Release>}
						view={query.view}
					/>
				)}

				<Pagination
					{...{ locale, query }}
					className={styles.pagination}
					count={releases.data.length}
					totalMatchingCount={releases.count}
				/>
			</div>
		</>
	);
}
