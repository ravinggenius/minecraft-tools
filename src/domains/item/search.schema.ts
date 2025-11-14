import { z } from "zod/v4";

import {
	OPTIONAL_BOOLEAN,
	OPTIONAL_INTEGER_ARRAY,
	OPTIONAL_INTEGER_RANGE,
	OPTIONAL_STRING_ARRAY
} from "@/library/search";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	identifier: OPTIONAL_STRING_ARRAY,
	variant: OPTIONAL_STRING_ARRAY,
	isVariant: OPTIONAL_BOOLEAN,
	translationKey: OPTIONAL_STRING_ARRAY,
	name: OPTIONAL_STRING_ARRAY,
	rarity: OPTIONAL_STRING_ARRAY,
	stackSize: OPTIONAL_INTEGER_ARRAY,
	edition: OPTIONAL_STRING_ARRAY,
	version: OPTIONAL_STRING_ARRAY,
	cycleName: OPTIONAL_STRING_ARRAY,
	cyclesCount: OPTIONAL_INTEGER_RANGE,
	releasesCount: OPTIONAL_INTEGER_RANGE,
	isAvailableForTools: OPTIONAL_BOOLEAN
});

export type Include = z.infer<typeof INCLUDE>;
