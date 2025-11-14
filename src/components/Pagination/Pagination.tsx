import classNames from "classnames";
import { Fragment } from "react";

import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

import Anchor from "../Anchor/Anchor";
import Join from "../Join/Join";
import {
	Include,
	Keywords,
	Query,
	Ranges
} from "../SearchForm/SearchForm.schema";

import styles from "./Pagination.module.scss";
import {
	constructPaginationList,
	nextSearchParams
} from "./Pagination.utilities";

export async function Pagination<
	TKeywords extends Keywords = Keywords,
	TRanges extends Ranges = Ranges,
	TInclude extends Include = Include,
	TQuery extends Query<TKeywords, TRanges, TInclude> = Query<
		TKeywords,
		TRanges,
		TInclude
	>
>({
	className,
	count,
	locale,
	query,
	totalMatchingCount
}: {
	className?: string;
	count: number;
	locale: SupportedLocale;
	query: TQuery;
	totalMatchingCount: bigint;
}) {
	const { t } = await loadPageTranslations(locale, "component-pagination");

	const { limit, offset } = query.pagination;

	const fullPagesCount = Number(totalMatchingCount / BigInt(limit));
	const partialPageCount = totalMatchingCount % BigInt(limit) ? 1 : 0;

	const firstPageNumber = 1;
	const currentPageNumber = Math.floor(offset / limit) + 1;
	const lastPageNumber = fullPagesCount + partialPageCount;

	const pageNumbersToDisplay = constructPaginationList(
		firstPageNumber,
		lastPageNumber,
		currentPageNumber,
		{ interiorSpread: 2 }
	);

	return totalMatchingCount === BigInt(0) ? null : (
		<nav className={classNames(styles.root, className)}>
			{currentPageNumber > firstPageNumber ? (
				<Anchor
					className={styles.previous}
					href={`?${new URLSearchParams(nextSearchParams(query, currentPageNumber - 1))}`}
					variant="inline"
				>
					{t("previous")}
				</Anchor>
			) : (
				<span className={styles.previous}>{t("previous")}</span>
			)}

			{currentPageNumber < lastPageNumber ? (
				<Anchor
					className={styles.next}
					href={`?${new URLSearchParams(nextSearchParams(query, currentPageNumber + 1))}`}
					variant="inline"
				>
					{t("next")}
				</Anchor>
			) : (
				<span className={styles.next}>{t("next")}</span>
			)}

			<ol className={styles.list}>
				<Join glue={<span className={styles.glue}>{t("glue")}</span>}>
					{pageNumbersToDisplay.map((pageNumbers) => (
						<Fragment key={pageNumbers.join("-")}>
							{pageNumbers.map((pageNumber) => (
								<li key={pageNumber}>
									{pageNumber === currentPageNumber ? (
										<span className={styles.current}>
											{t("page-number", { pageNumber })}
										</span>
									) : (
										<Anchor
											href={`?${new URLSearchParams(nextSearchParams(query, pageNumber))}`}
											variant="inline"
										>
											{t("page-number", { pageNumber })}
										</Anchor>
									)}
								</li>
							))}
						</Fragment>
					))}
				</Join>
			</ol>

			<p
				aria-label={t("summary.reader", {
					countStart: offset + 1,
					countEnd: offset + count,
					totalMatchingCount: Number(totalMatchingCount)
				})}
				className={styles.summary}
			>
				{t("summary.display", {
					countStart: offset + 1,
					countEnd: offset + count,
					totalMatchingCount: Number(totalMatchingCount)
				})}
			</p>
		</nav>
	);
}
