import { SEACH_QUERY } from "@/components/SearchForm/SearchForm.schema";
import { Include } from "@/domains/item-identity/search.schema";
import FLEXIBLE_BOOL from "@/library/utility-schemas/flexible-boolean";

export const QUERY = SEACH_QUERY(
	["identifier", "variant", "is-variant"] as const,
	[] as const,
	(rawQuery) =>
		({
			text: rawQuery.text,
			identifier: rawQuery.identifier,
			variant: rawQuery.variant,
			isVariant: FLEXIBLE_BOOL.optional().parse(
				rawQuery["is-variant"]?.[rawQuery["is-variant"].length - 1]
			)
		}) satisfies Include
);
