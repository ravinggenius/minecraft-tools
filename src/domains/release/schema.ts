import { z } from "zod/v4";

import { PLATFORM } from "../platform/schema";

export const EDITION = z.enum(["bedrock", "java"]);

export type Edition = z.infer<typeof EDITION>;

export const UPCOMING = z.literal("upcoming");

export const RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	edition: EDITION,
	version: z.string().regex(/\d+(?:\.\d+){1,3}/),
	cycleName: z.string().optional(),
	developmentReleasedOn: z.iso.date().optional(),
	firstProductionReleasedOn: z.iso.date().optional(),
	changelog: z.url().optional(),
	isAvailableForTools: z.coerce.boolean(),
	isLatest: z.boolean().readonly(),
	platforms: z.array(
		PLATFORM.omit({
			id: true,
			createdAt: true,
			updatedAt: true
		}).extend({
			platformId: PLATFORM.shape.id,
			productionReleasedOn: z.iso.date()
		})
	)
});

export type Release = z.infer<typeof RELEASE>;

export const SPECIFIC_RELEASE = RELEASE.omit({
	firstProductionReleasedOn: true,
	platforms: true
})
	.extend({
		releaseId: RELEASE.shape.id
	})
	.and(
		z.union([
			z.object({
				productionReleasedOn:
					RELEASE.shape.firstProductionReleasedOn.nonoptional(),
				platformName: PLATFORM.shape.name
			}),
			z.object({
				productionReleasedOn: z.never().optional(),
				platformName: z.never().optional()
			})
		])
	);

export type SpecificRelease = z.infer<typeof SPECIFIC_RELEASE>;

export const RELEASE_ATTRS = RELEASE.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	firstProductionReleasedOn: true,
	isLatest: true,
	platforms: true
}).extend({
	platforms: z
		.array(
			PLATFORM.omit({
				id: true,
				createdAt: true,
				updatedAt: true,
				name: true
			}).extend({
				platformId: PLATFORM.shape.id,
				productionReleasedOn: z.iso.date()
			})
		)
		.default([])
});

export type ReleaseAttrs = z.infer<typeof RELEASE_ATTRS>;

export const IMPORT_RELEASE = RELEASE.pick({
	edition: true,
	version: true,
	developmentReleasedOn: true,
	changelog: true
}).extend({
	cycleName: z.string(),
	platformsCondensed: z.record(
		z.union([
			UPCOMING,
			RELEASE.shape.firstProductionReleasedOn.nonoptional()
		]),
		z.array(PLATFORM.shape.name)
	)
});

export type ImportRelease = z.infer<typeof IMPORT_RELEASE>;

export const IMPORT_RELEASES = z.array(IMPORT_RELEASE);

export type ImportReleases = z.infer<typeof IMPORT_RELEASES>;
