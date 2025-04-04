import { parse } from "date-fns";
import { z, ZodSchema, ZodTransformer, ZodTypeAny } from "zod";

export const OPTIONAL_STRING_ARRAY = z.array(z.string()).optional();

export const OPTIONAL_RANGE = z
	.object({
		from: z.string(),
		to: z.string().optional()
	})
	.optional();

const CYCLE_TUPLE = z.tuple([
	z.union([z.literal(0), z.literal(1)]),
	z.number().nonnegative().int()
]);

export const OPTIONAL_DATE_RANGE = OPTIONAL_RANGE.transform((range) =>
	range
		? {
				from: z.coerce
					.date()
					.parse(parse(range.from, "yyyyMMdd", new Date())),
				to: range.to
					? z.coerce
							.date()
							.parse(parse(range.to, "yyyyMMdd", new Date()))
					: undefined
			}
		: undefined
);

export const OPTIONAL_CYCLE_RANGE = OPTIONAL_RANGE.transform((range) =>
	range
		? {
				from: CYCLE_TUPLE.parse(
					range.from.split(".").map((n) => Number.parseInt(n, 10))
				),
				to: range.to
					? CYCLE_TUPLE.parse(
							range.to
								.split(".")
								.map((n) => Number.parseInt(n, 10))
						)
					: undefined
			}
		: undefined
);

export const OPTIONAL_BOOLEAN = z.boolean().optional();

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

export const DEFAULT_EXPAND_VERSIONS = false;

export const SEARCH_PARAMS = <TInclude>(
	include: ZodSchema<TInclude> | ZodTransformer<ZodTypeAny, TInclude>
) =>
	z.object({
		conditions: z.object({
			include,
			exclude: z.unknown()
		}),
		expand: z.boolean(),
		pagination: z.object({
			limit: z.number().nonnegative().int().max(MAX_PAGE_SIZE),
			offset: z.number().nonnegative().int()
		})
	});

export type SearchParams<TInclude> = z.infer<
	ReturnType<typeof SEARCH_PARAMS<TInclude>>
>;

export const COUNT = z.object({
	count: z.bigint().nonnegative()
});

export interface SearchResults<TRecord> {
	count: z.infer<typeof COUNT.shape.count>;
	data: Readonly<Array<TRecord>>;
}
