import { Metadata } from "next";

import Anchor from "@/components/Anchor/Anchor";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { Pagination } from "@/components/Pagination/Pagination";
import SearchForm from "@/components/SearchForm/SearchForm";
import * as releaseCycleModel from "@/domains/release-cycle/model";
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
}: PageProps<"/[locale]/command/release-cycles">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-release-cycles",
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
}: PageProps<"/[locale]/command/release-cycles">) {
	const { locale } = await ensureParams(PARAMS, params);

	const query = await ensureSearchParams(QUERY, searchParams);

	await enforceAuthorization(["read", "any", "release-cycle"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" },
		{ name: "release-cycles" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-command-release-cycles",
		{
			keyPrefix: "content"
		}
	);

	const releaseCycles = await releaseCycleModel.search(query);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.root}>
				<p>{t("description")}</p>

				<Anchor
					href={`/${locale}/command/release-cycles/new`}
					variant="primary"
				>
					{t("new-cta")}
				</Anchor>

				<SearchForm {...{ query }} className={styles.form} />

				<PageSearchResults
					{...{ locale }}
					className={styles.results}
					releaseCycles={releaseCycles.data}
					view={query.view}
				/>

				<Pagination
					{...{ locale, query }}
					className={styles.pagination}
					count={releaseCycles.data.length}
					totalMatchingCount={releaseCycles.count}
				/>
			</article>
		</>
	);
}
