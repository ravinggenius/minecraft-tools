import { SEACH_QUERY } from "@/components/SearchForm/SearchForm.schema";
import { INCLUDE, Include } from "@/domains/release/search.schema";
import FLEXIBLE_BOOL from "@/library/utility-schemas/flexible-boolean";

export const QUERY = SEACH_QUERY(
	[
		"edition",
		"version",
		"cycle",
		"is-available-for-tools",
		"is-latest",
		"platform"
	] as const,
	["first-released-on"] as const,
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
			isLatest: FLEXIBLE_BOOL.optional().parse(
				rawQuery["is-latest"]?.[rawQuery["is-latest"].length - 1]
			),
			platformName: rawQuery.platform,
			firstProductionReleasedOn:
				INCLUDE.shape.firstProductionReleasedOn.parse(
					rawQuery["first-released-on"]
				)
		}) satisfies Include
);
