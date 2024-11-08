import parser, { SearchParserResult } from "search-query-parser";
import { z } from "zod";

import {
	DEFAULT_EXPAND_VERSIONS,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE
} from "@/library/search";

export type Keywords = readonly [string, ...Array<string>];

export type Ranges = readonly [string, ...Array<string>];

type RawQuery<
	TKeywords extends Keywords = Keywords,
	TRanges extends Ranges = Ranges
> = SearchParserResult & {
	text?: string[];
} & Partial<Record<TKeywords[number], Array<string>>> &
	Partial<
		Record<
			TRanges[number],
			{
				from: string;
				to?: string | undefined;
			}
		>
	>;

export type Include = {
	text?: Array<string>;
	[key: string]: unknown;
};

export const RAW_SEACH_QUERY = z.object({
	q: z.string().optional().default("").catch(""),
	o: z.coerce.number().nonnegative().int().optional().default(0).catch(0),
	l: z.coerce
		.number()
		.nonnegative()
		.int()
		.max(MAX_PAGE_SIZE)
		.optional()
		.default(DEFAULT_PAGE_SIZE)
		.catch(DEFAULT_PAGE_SIZE),
	e: z.coerce
		.boolean()
		.optional()
		.default(DEFAULT_EXPAND_VERSIONS)
		.catch(DEFAULT_EXPAND_VERSIONS),
	v: z.enum(["list", "table"]).optional().default("list").catch("list")
});

export interface RawSearchQuery extends z.infer<typeof RAW_SEACH_QUERY> {}

export const SEACH_QUERY = <
	TKeywords extends Keywords = Keywords,
	TRanges extends Ranges = Ranges,
	TInclude extends Include = Include
>(
	keywords: TKeywords,
	ranges: TRanges,
	extractInclude: (rawQuery: RawQuery<TKeywords, TRanges>) => TInclude
) =>
	RAW_SEACH_QUERY.transform(({ q, o, l, e, v }) => {
		const query = parser.parse(q, {
			offsets: true,
			tokenize: true,
			keywords: [...keywords],
			ranges: [...ranges],
			alwaysArray: true
		}) as RawQuery<TKeywords, TRanges>;

		return {
			keywords: [...keywords],
			ranges: [...ranges],
			query: q,
			offsets: query.offsets as NonNullable<typeof query.offsets>,
			conditions: {
				include: extractInclude(query),
				exclude: query.exclude ?? {}
			},
			expand: e,
			view: v,
			pagination: {
				offset: o,
				limit: l
			}
		};
	});

export interface Query<
	TKeywords extends Keywords = Keywords,
	TRanges extends Ranges = Ranges,
	TInclude extends Include = Include
> extends z.infer<
		ReturnType<typeof SEACH_QUERY<TKeywords, TRanges, TInclude>>
	> {}
