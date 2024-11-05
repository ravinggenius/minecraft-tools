import { z } from "zod";

import { SEACH_QUERY } from "@/components/SearchForm/SearchForm.schema";
import { INCLUDE, Include } from "@/domains/release/search.schema";

const BOOL = z.coerce.boolean().optional();

export const QUERY = SEACH_QUERY(
	[
		"edition",
		"version",
		"is-earliest-in-cycle",
		"is-latest-in-cycle",
		"is-latest"
	] as const,
	["cycle"] as const,
	(rawQuery) =>
		({
			text: rawQuery.text,
			edition: rawQuery.edition,
			version: rawQuery.version,
			cycle: INCLUDE.shape.cycle.parse(rawQuery.cycle),
			isEarliestInCycle: BOOL.parse(
				rawQuery["is-earliest-in-cycle"]?.[
					rawQuery["is-earliest-in-cycle"].length - 1
				]
			),
			isLatestInCycle: BOOL.parse(
				rawQuery["is-latest-in-cycle"]?.[
					rawQuery["is-latest-in-cycle"].length - 1
				]
			),
			isLatest: BOOL.parse(
				rawQuery["is-latest"]?.[rawQuery["is-latest"].length - 1]
			)
		}) satisfies Include
);
