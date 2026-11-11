import { SEACH_QUERY } from "@/components/SearchForm/SearchForm.schema";
import { Include } from "@/domains/item-rarity/search.schema";

export const QUERY = SEACH_QUERY(
	["identifier"] as const,
	[] as const,
	(rawQuery) =>
		({
			text: rawQuery.text,
			identifier: rawQuery.identifier
		}) satisfies Include
);
