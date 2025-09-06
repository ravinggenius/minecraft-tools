import { z } from "zod/v4";

import { PLATFORM } from "../platform/schema";

export const EDITION = z.enum(["bedrock", "java"]);

export type Edition = z.infer<typeof EDITION>;

export const UPCOMING = z.literal("upcoming");

export const RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	edition: EDITION,
	version: z.string(),
	name: z.string().optional(),
	developmentReleasedOn: z.coerce.date().optional(),
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

export const IMPORT_RELEASE = RELEASE.pick({
	edition: true,
	version: true,
	name: true,
	developmentReleasedOn: true,
	changelog: true
}).extend({
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
