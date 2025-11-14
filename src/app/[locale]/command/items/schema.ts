import { z } from "zod/v4";

import { SEACH_QUERY } from "@/components/SearchForm/SearchForm.schema";
import { INCLUDE, Include } from "@/domains/item/search.schema";
import FLEXIBLE_BOOL from "@/library/utility-schemas/flexible-boolean";

export const QUERY = SEACH_QUERY(
	[
		"edition",
		"version",
		"cycle",
		"is-available-for-tools",
		"identifier",
		"variant",
		"translation-key",
		"name",
		"rarity",
		"stack-size"
	] as const,
	["cycles-count", "releases-count"] as const,
	(rawQuery) =>
		({
			text: rawQuery.text,
			edition: rawQuery.edition,
			version: rawQuery.version,
			cycleName: rawQuery.cycle,
			isAvailableForTools: FLEXIBLE_BOOL.optional().parse(
				rawQuery["is-available-for-tools"]?.[
					rawQuery["is-available-for-tools"].length - 1
				]
			),
			identifier: rawQuery.identifier,
			variant: rawQuery.variant,
			translationKey: rawQuery["translation-key"],
			name: rawQuery.name,
			rarity: rawQuery.rarity,
			stackSize: INCLUDE.shape.stackSize.parse(rawQuery["stack-size"]),
			cyclesCount: INCLUDE.shape.cyclesCount.parse(
				rawQuery["cycles-count"]
			),
			releasesCount: INCLUDE.shape.releasesCount.parse(
				rawQuery["releases-count"]
			)
		}) satisfies Include
);

export type QueryIn = z.input<typeof QUERY>;
export type Query = z.infer<typeof QUERY>;
export type QueryOut = z.output<typeof QUERY>;
