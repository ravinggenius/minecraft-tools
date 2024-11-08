import { Dictionary, filter, isNotNil } from "rambda";

import { DEFAULT_EXPAND_VERSIONS, DEFAULT_PAGE_SIZE } from "@/library/search";

import {
	Include,
	Keywords,
	Query,
	Ranges
} from "../SearchForm/SearchForm.schema";

export const collateConsecutive = (numbers: Array<number>) =>
	numbers.reduce<Array<Array<number>>>((memo, number) => {
		const lastGroup = memo[memo.length - 1];

		if (
			Array.isArray(lastGroup) &&
			lastGroup[lastGroup.length - 1] + 1 === number
		) {
			return [...memo.slice(0, memo.length - 1), [...lastGroup, number]];
		} else if (
			Array.isArray(lastGroup) &&
			lastGroup[lastGroup.length - 1] + 2 === number
		) {
			return [
				...memo.slice(0, memo.length - 1),
				[...lastGroup, number - 1, number]
			];
		} else {
			return [...memo, [number]];
		}
	}, []);

export const constructPaginationList = (
	firstPageNumber: number,
	lastPageNumber: number,
	currentPageNumber: number,
	{ interiorSpread }: { interiorSpread: number }
) => {
	let currentPageRangeStart = Math.max(
		firstPageNumber,
		currentPageNumber - interiorSpread
	);
	let currentPageRangeEnd = Math.min(
		lastPageNumber,
		currentPageNumber + interiorSpread
	);

	if (currentPageNumber <= interiorSpread + firstPageNumber) {
		currentPageRangeEnd = Math.min(
			lastPageNumber,
			currentPageRangeEnd +
				(interiorSpread + firstPageNumber - currentPageNumber)
		);
	} else if (currentPageNumber >= lastPageNumber - interiorSpread) {
		currentPageRangeStart = Math.max(
			firstPageNumber,
			currentPageRangeStart -
				(interiorSpread - (lastPageNumber - currentPageNumber))
		);
	}

	const middlePageNumbers = Array.from(
		{ length: currentPageRangeEnd - currentPageRangeStart + 1 },
		(_, i) => currentPageRangeStart + i
	);

	return collateConsecutive([
		...(middlePageNumbers.includes(firstPageNumber)
			? []
			: [firstPageNumber]),
		...middlePageNumbers,
		...(middlePageNumbers.includes(lastPageNumber) ? [] : [lastPageNumber])
	]);
};

export const nextSearchParams = <
	TKeywords extends Keywords = Keywords,
	TRanges extends Ranges = Ranges,
	TInclude extends Include = Include,
	TQuery extends Query<TKeywords, TRanges, TInclude> = Query<
		TKeywords,
		TRanges,
		TInclude
	>
>(
	query: TQuery,
	pageNumber: number
) => {
	const { limit } = query.pagination;

	const offset = limit * (pageNumber - 1);

	const pageParams = {
		q: query.query === "" ? undefined : query.query,
		o: offset === 0 ? undefined : offset.toString(),
		l: limit === DEFAULT_PAGE_SIZE ? undefined : limit.toString(),
		e:
			query.expand === DEFAULT_EXPAND_VERSIONS
				? undefined
				: query.expand.toString(),
		v: query.view === "list" ? undefined : query.view
	};

	return filter(isNotNil, pageParams) as Dictionary<string> as Record<
		string,
		string
	>;
};
