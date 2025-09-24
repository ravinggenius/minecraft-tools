import { z } from "zod/v4";

import {
	OPTIONAL_BOOLEAN,
	OPTIONAL_DATE_RANGE,
	OPTIONAL_STRING_ARRAY
} from "@/library/search";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	edition: OPTIONAL_STRING_ARRAY,
	version: OPTIONAL_STRING_ARRAY,
	cycleName: OPTIONAL_STRING_ARRAY,
	isAvailableForTools: OPTIONAL_BOOLEAN,
	isLatest: OPTIONAL_BOOLEAN,
	platformName: OPTIONAL_STRING_ARRAY,
	firstProductionReleasedOn: OPTIONAL_DATE_RANGE
});

export type Include = z.infer<typeof INCLUDE>;
