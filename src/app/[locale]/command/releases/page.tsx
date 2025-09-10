import { Metadata } from "next";

import Anchor from "@/components/Anchor/Anchor";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { Pagination } from "@/components/Pagination/Pagination";
import SearchForm from "@/components/SearchForm/SearchForm";
import * as releaseModel from "@/domains/release/model";
import { Release, SpecificRelease } from "@/domains/release/schema";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import {
	ensureParams,
	ensureSearchParams,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import PageSearchResults from "../../compendium/releases/search-results";
import PageSearchResultsExpanded from "../../compendium/releases/search-results-expanded";

import styles from "./page.module.scss";
import { QUERY } from "./schema";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/command/releases">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-command-releases", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params,
	searchParams
}: PageProps<"/[locale]/command/releases">) {
	const { locale } = await ensureParams(PARAMS, params);

	const query = await ensureSearchParams(QUERY, searchParams);

	await enforceAuthorization(["read", "any", "release"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "releases" }
	]);

	const { t } = await loadPageTranslations(locale, "page-command-releases", {
		keyPrefix: "content"
	});

	const releases = query.expand
		? await releaseModel.searchExpanded(query)
		: await releaseModel.search(query);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>{t("description")}</p>

				<Anchor
					href={`/${locale}/command/releases/new`}
					variant="primary"
				>
					{t("new-cta")}
				</Anchor>

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
			</article>
		</>
	);
}
