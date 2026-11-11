import { SEACH_QUERY } from "@/components/SearchForm/SearchForm.schema";
import { INCLUDE, Include } from "@/domains/item-stack-size/search.schema";

export const QUERY = SEACH_QUERY(
	["identifier"] as const,
	[] as const,
	(rawQuery) =>
		({
			text: rawQuery.text,
			identifier: INCLUDE.shape.identifier.parse(rawQuery.identifier)
		}) satisfies Include
);
