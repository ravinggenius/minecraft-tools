import { z } from "zod/v4";

import { PLATFORM } from "../platform/schema";
import { RELEASE_CYCLE } from "../release-cycle/schema";

export const EDITION = z.enum(["bedrock", "java"]);

export type Edition = z.infer<typeof EDITION>;

export const RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	edition: EDITION,
	version: z.string().regex(/\d+(?:\.\d+){1,3}/),
	cycleId: RELEASE_CYCLE.shape.id.optional(),
	developmentReleasedOn: z.iso.date().optional(),
	changelog: z.url().optional(),
	isAvailableForTools: z.coerce.boolean(),
	isLatest: z.boolean().readonly()
});

export type Release = z.infer<typeof RELEASE>;

export const PLATFORM_RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	platformId: PLATFORM.shape.id,
	releaseId: RELEASE.shape.id,
	productionReleasedOn: z.iso.date()
});

export type PlatformRelease = z.infer<typeof PLATFORM_RELEASE>;

export const FLATTENED_RELEASE = RELEASE.pick({
	edition: true,
	version: true,
	developmentReleasedOn: true,
	changelog: true,
	isLatest: true,
	isAvailableForTools: true
})
	.extend({
		id: z
			.union([PLATFORM_RELEASE.shape.id, RELEASE.shape.id])
			.describe("Either the platform release ID or the release ID"),
		releaseId: RELEASE.shape.id,
		cycle: RELEASE_CYCLE.pick({
			id: true,
			name: true
		}).optional(),
		firstProductionReleasedOn:
			PLATFORM_RELEASE.shape.productionReleasedOn.optional()
	})
	.and(
		z.union([
			z.object({
				platformReleaseId: PLATFORM_RELEASE.shape.id,
				platform: PLATFORM.pick({
					id: true,
					name: true
				}).extend({
					productionReleasedOn:
						PLATFORM_RELEASE.shape.productionReleasedOn
				})
			}),
			z.object({
				platformReleaseId: z.never().optional(),
				platform: z.never().optional()
			})
		])
	);

export type FlattenedRelease = z.infer<typeof FLATTENED_RELEASE>;

export const NORMALIZED_RELEASE = RELEASE.omit({
	createdAt: true,
	updatedAt: true,
	cycleId: true
})
	.extend({
		cycle: RELEASE_CYCLE.pick({
			id: true,
			name: true
		}).optional()
	})
	.and(
		z.union([
			z.object({
				firstProductionReleasedOn:
					PLATFORM_RELEASE.shape.productionReleasedOn.optional(),
				platforms: z.array(
					PLATFORM.pick({
						id: true,
						name: true
					}).extend({
						productionReleasedOn:
							PLATFORM_RELEASE.shape.productionReleasedOn
					})
				)
			}),
			z.object({
				firstProductionReleasedOn: z.never().optional(),
				platforms: z.array(z.never())
			})
		])
	);

export type NormalizedRelease = z.infer<typeof NORMALIZED_RELEASE>;

export const RELEASE_ATTRS = RELEASE.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	cycleId: true,
	isLatest: true
}).extend({
	cycle: z.object({
		id: RELEASE_CYCLE.shape.id.optional()
	}),
	platforms: z
		.array(
			PLATFORM.omit({
				createdAt: true,
				updatedAt: true,
				name: true
			}).extend({
				productionReleasedOn:
					PLATFORM_RELEASE.shape.productionReleasedOn
			})
		)
		.default([])
});

export type ReleaseAttrs = z.infer<typeof RELEASE_ATTRS>;

export const UPCOMING = z.literal("upcoming");

export const IMPORT_RELEASE = RELEASE.pick({
	edition: true,
	version: true,
	developmentReleasedOn: true,
	changelog: true
}).extend({
	cycleName: RELEASE_CYCLE.shape.name,
	platformsCondensed: z.record(
		z.union([UPCOMING, PLATFORM_RELEASE.shape.productionReleasedOn]),
		z.array(PLATFORM.shape.name)
	)
});

export type ImportRelease = z.infer<typeof IMPORT_RELEASE>;

export const IMPORT_RELEASES = z.array(IMPORT_RELEASE);

export type ImportReleases = z.infer<typeof IMPORT_RELEASES>;
