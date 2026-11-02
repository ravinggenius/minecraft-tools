import { SEACH_QUERY } from "@/components/SearchForm/SearchForm.schema";
import { INCLUDE, Include } from "@/domains/item/search.schema";
import FLEXIBLE_BOOL from "@/library/utility-schemas/flexible-boolean";

export const QUERY = SEACH_QUERY(
	[
		"identifier",
		"variant",
		"is-variant",
		"color",
		"rarity",
		"stack-size",
		"translation-key"
	] as const,
	[] as const,
	(rawQuery) =>
		({
			text: rawQuery.text,
			identifier: rawQuery.identifier,
			variant: rawQuery.variant,
			isVariant: FLEXIBLE_BOOL.optional().parse(
				rawQuery["is-variant"]?.[rawQuery["is-variant"].length - 1]
			),
			color: rawQuery.color,
			rarity: rawQuery.rarity,
			stackSize: INCLUDE.shape.stackSize.parse(rawQuery["stack-size"]),
			translationKey: rawQuery["translation-key"]
		}) satisfies Include
);
