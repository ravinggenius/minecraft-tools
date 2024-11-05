import SearchForm from "@/components/SearchForm/SearchForm";
import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	ensureSearchParams,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";
import { PageGenerateMetadata, PageProps } from "@/library/route-meta.schema";

import styles from "./page.module.scss";
import { QUERY } from "./schema";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
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
	};
};

export default async function Page({ params, searchParams }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const query = await ensureSearchParams(QUERY, searchParams);

	const { t } = await loadPageTranslations(
		locale,
		"page-compendium-releases",
		{
			keyPrefix: "content"
		}
	);

	return (
		<div className={styles.root}>
			<SearchForm {...{ query }} />

			<p>search results</p>

			<p>pagination</p>
		</div>
	);
}
