import { z } from "zod/v4";

import { OPTIONAL_BOOLEAN, OPTIONAL_STRING_ARRAY } from "@/library/search";

import { RELEASE } from "../release/schema";

import { PLATFORM } from "./schema";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	name: OPTIONAL_STRING_ARRAY,
	edition: OPTIONAL_STRING_ARRAY,
	isAvailableForTools: OPTIONAL_BOOLEAN
});

export type Include = z.infer<typeof INCLUDE>;

export const NORMALIZED_PLATFORM = PLATFORM.omit({
	createdAt: true,
	updatedAt: true
}).extend({
	releasesCount: z.bigint().nonnegative(),
	editions: z.array(RELEASE.shape.edition),
	isAvailableForTools: RELEASE.shape.isAvailableForTools
});

export type NormalizedPlatform = z.infer<typeof NORMALIZED_PLATFORM>;
