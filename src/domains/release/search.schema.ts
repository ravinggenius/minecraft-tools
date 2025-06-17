import { z } from "zod/v4";

import {
	OPTIONAL_BOOLEAN,
	OPTIONAL_CYCLE_RANGE,
	OPTIONAL_DATE_RANGE,
	OPTIONAL_STRING_ARRAY
} from "@/library/search";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	edition: OPTIONAL_STRING_ARRAY,
	version: OPTIONAL_STRING_ARRAY,
	cycle: OPTIONAL_CYCLE_RANGE,
	isAvailableForTools: OPTIONAL_BOOLEAN,
	isEarliestInCycle: OPTIONAL_BOOLEAN,
	isLatestInCycle: OPTIONAL_BOOLEAN,
	isLatest: OPTIONAL_BOOLEAN,
	platform: OPTIONAL_STRING_ARRAY,
	releasedOn: OPTIONAL_DATE_RANGE
});

export interface Include extends z.infer<typeof INCLUDE> {}
