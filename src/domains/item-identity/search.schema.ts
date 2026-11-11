import { z } from "zod/v4";

import { OPTIONAL_BOOLEAN, OPTIONAL_STRING_ARRAY } from "@/library/search";

import { ITEM_IDENTITY } from "./schema";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	identifier: OPTIONAL_STRING_ARRAY,
	variant: OPTIONAL_STRING_ARRAY,
	isVariant: OPTIONAL_BOOLEAN
});

export type Include = z.infer<typeof INCLUDE>;

export const NORMALIZED_ITEM_IDENTITY = ITEM_IDENTITY.extend({
	usageCount: z.int().nonnegative()
});

export type NormalizedItemIdentity = z.infer<typeof NORMALIZED_ITEM_IDENTITY>;
