import { z } from "zod/v4";

import { OPTIONAL_STRING_ARRAY } from "@/library/search";

import { ITEM_RARITY } from "./schema";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	identifier: OPTIONAL_STRING_ARRAY
});

export type Include = z.infer<typeof INCLUDE>;

export const NORMALIZED_ITEM_RARITY = ITEM_RARITY.extend({
	usageCount: z.int().nonnegative()
});

export type NormalizedItemRarity = z.infer<typeof NORMALIZED_ITEM_RARITY>;
