import { z } from "zod/v4";

import { OPTIONAL_STRING_ARRAY } from "@/library/search";

import { ITEM_TRANSLATION_KEY } from "./schema";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	identifier: OPTIONAL_STRING_ARRAY
});

export type Include = z.infer<typeof INCLUDE>;

export const NORMALIZED_ITEM_TRANSLATION_KEY = ITEM_TRANSLATION_KEY.extend({
	usageCount: z.int().nonnegative()
});

export type NormalizedItemTranslationKey = z.infer<
	typeof NORMALIZED_ITEM_TRANSLATION_KEY
>;
