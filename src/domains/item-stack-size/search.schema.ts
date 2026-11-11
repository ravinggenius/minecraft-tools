import { z } from "zod/v4";

import {
	OPTIONAL_INTEGER_ARRAY,
	OPTIONAL_STRING_ARRAY
} from "@/library/search";

import { ITEM_STACK_SIZE } from "./schema";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	identifier: OPTIONAL_INTEGER_ARRAY
});

export type Include = z.infer<typeof INCLUDE>;

export const NORMALIZED_ITEM_STACK_SIZE = ITEM_STACK_SIZE.extend({
	usageCount: z.int().nonnegative()
});

export type NormalizedItemStackSize = z.infer<
	typeof NORMALIZED_ITEM_STACK_SIZE
>;
