import { z } from "zod/v4";

import { OPTIONAL_BOOLEAN, OPTIONAL_STRING_ARRAY } from "@/library/search";

import { PLATFORM_RELEASE, RELEASE } from "../release/schema";

import { RELEASE_CYCLE } from "./schema";

export const INCLUDE = z.object({
	text: OPTIONAL_STRING_ARRAY,
	name: OPTIONAL_STRING_ARRAY,
	edition: OPTIONAL_STRING_ARRAY,
	isAvailableForTools: OPTIONAL_BOOLEAN
});

export type Include = z.infer<typeof INCLUDE>;

export const FLATTENED_RELEASE_CYCLE = RELEASE_CYCLE.omit({
	createdAt: true,
	updatedAt: true
}).extend({
	release: RELEASE.pick({
		id: true,
		edition: true,
		version: true,
		isAvailableForTools: true
	})
		.extend({
			productionReleasedOn: PLATFORM_RELEASE.shape.productionReleasedOn
		})
		.optional()
});

export type FlattenedReleaseCycle = z.infer<typeof FLATTENED_RELEASE_CYCLE>;

export const NORMALIZED_RELEASE_CYCLE = RELEASE_CYCLE.omit({
	createdAt: true,
	updatedAt: true
}).extend({
	releasesCount: z.bigint().nonnegative(),
	editions: z.array(RELEASE.shape.edition),
	firstProductionReleasedOn:
		PLATFORM_RELEASE.shape.productionReleasedOn.optional(),
	isAvailableForTools: RELEASE.shape.isAvailableForTools
});

export type NormalizedReleaseCycle = z.infer<typeof NORMALIZED_RELEASE_CYCLE>;
