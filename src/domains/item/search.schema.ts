import { z } from "zod/v4";

import {
	OPTIONAL_BOOLEAN,
	OPTIONAL_INTEGER_ARRAY,
	OPTIONAL_STRING_ARRAY
} from "@/library/search";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	identifier: OPTIONAL_STRING_ARRAY,
	variant: OPTIONAL_STRING_ARRAY,
	isVariant: OPTIONAL_BOOLEAN,
	color: OPTIONAL_STRING_ARRAY,
	rarity: OPTIONAL_STRING_ARRAY,
	stackSize: OPTIONAL_INTEGER_ARRAY,
	translationKey: OPTIONAL_STRING_ARRAY
});

export type Include = z.infer<typeof INCLUDE>;
