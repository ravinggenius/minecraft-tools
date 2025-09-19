import { z } from "zod/v4";

import { SEACH_QUERY } from "@/components/SearchForm/SearchForm.schema";
import { INCLUDE, Include } from "@/domains/release/search.schema";

const BOOL = z.coerce.boolean().optional();

export const QUERY = SEACH_QUERY(
	["edition", "version", "cycle", "is-latest", "platform"] as const,
	["production-released-on"] as const,
	(rawQuery) =>
		({
			text: rawQuery.text,
			edition: rawQuery.edition,
			version: rawQuery.version,
			cycleName: rawQuery.cycle,
			isLatest: BOOL.parse(
				rawQuery["is-latest"]?.[rawQuery["is-latest"].length - 1]
			),
			platform: rawQuery.platform,
			productionReleasedOn: INCLUDE.shape.productionReleasedOn.parse(
				rawQuery["production-released-on"]
			)
		}) satisfies Include
);
