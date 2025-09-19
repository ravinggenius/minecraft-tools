import { SEACH_QUERY } from "@/components/SearchForm/SearchForm.schema";
import { Include } from "@/domains/release-cycle/search.schema";
import FLEXIBLE_BOOL from "@/library/utility-schemas/flexible-boolean";

export const QUERY = SEACH_QUERY(
	["name", "edition", "is-available-for-tools"] as const,
	[] as const,
	(rawQuery) =>
		({
			text: rawQuery.text,
			name: rawQuery.name,
			edition: rawQuery.edition,
			isAvailableForTools: FLEXIBLE_BOOL.optional().parse(
				rawQuery["is-available-for-tools"]?.[
					rawQuery["is-available-for-tools"].length - 1
				]
			)
		}) satisfies Include
);
