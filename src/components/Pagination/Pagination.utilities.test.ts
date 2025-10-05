import { describe, expect, test } from "vitest";

import {
	collateConsecutive,
	constructPaginationList,
	nextSearchParams
} from "./Pagination.utilities";

describe(collateConsecutive.name, () => {
	test("only consecutive numbers", () => {
		expect(collateConsecutive([1, 2, 3, 4, 5])).toEqual([[1, 2, 3, 4, 5]]);
	});

	test("no consecutive numbers", () => {
		expect(collateConsecutive([1, 5, 9])).toEqual([[1], [5], [9]]);
	});

	test("two groups", () => {
		expect(collateConsecutive([1, 2, 3, 11, 12, 13])).toEqual([
			[1, 2, 3],
			[11, 12, 13]
		]);
	});
});

describe(constructPaginationList.name, () => {
	test("only one page", () => {
		expect(constructPaginationList(1, 1, 1, { interiorSpread: 3 })).toEqual(
			[[1]]
		);
	});

	test("spread is more than total", () => {
		expect(
			constructPaginationList(1, 9, 4, { interiorSpread: 10 })
		).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9]]);
	});

	describe("spread is less than total", () => {
		test("centered", () => {
			expect(
				constructPaginationList(1, 42, 21, { interiorSpread: 1 })
			).toEqual([[1], [20, 21, 22], [42]]);
		});

		test("leading", () => {
			expect(
				constructPaginationList(1, 42, 4, { interiorSpread: 2 })
			).toEqual([[1, 2, 3, 4, 5, 6], [42]]);
		});

		test("trailing", () => {
			expect(
				constructPaginationList(1, 42, 40, { interiorSpread: 3 })
			).toEqual([[1], [36, 37, 38, 39, 40, 41, 42]]);
		});
	});
});

describe(nextSearchParams.name, () => {
	const basicQuery = {
		query: "foo",
		expand: false,
		view: "list" as const,
		pagination: {
			offset: 0,
			limit: 20
		}
	};

	test("no search", () => {
		expect(nextSearchParams({ ...basicQuery, query: "" }, 1)).toEqual({});
	});

	test("first page", () => {
		expect(nextSearchParams(basicQuery, 1)).toEqual({ q: "foo" });
	});

	test("page two", () => {
		expect(nextSearchParams(basicQuery, 2)).toEqual({ q: "foo", o: "20" });
	});

	test("expanded table view", () => {
		expect(
			nextSearchParams(
				{ ...basicQuery, expand: true, view: "table" as const },
				2
			)
		).toEqual({ q: "foo", e: "true", v: "table", o: "20" });
	});
});
