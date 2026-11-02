import { z } from "zod/v4";

import { OPTIONAL_BOOLEAN, OPTIONAL_STRING_ARRAY } from "@/library/search";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	identifier: OPTIONAL_STRING_ARRAY,
	variant: OPTIONAL_STRING_ARRAY,
	isVariant: OPTIONAL_BOOLEAN
});

export type Include = z.infer<typeof INCLUDE>;
