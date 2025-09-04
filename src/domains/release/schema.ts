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
	firstProductionReleasedOn: z.iso.date(),
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

export interface Release extends z.infer<typeof RELEASE> {}

export const SPECIFIC_RELEASE = RELEASE.omit({
	firstProductionReleasedOn: true,
	platforms: true
}).extend({
	releaseId: RELEASE.shape.id,
	productionReleasedOn: RELEASE.shape.firstProductionReleasedOn,
	platformName: z.string()
});

export interface SpecificRelease extends z.infer<typeof SPECIFIC_RELEASE> {}

export const IMPORT_RELEASE = RELEASE.pick({
	edition: true,
	version: true,
	name: true,
	developmentReleasedOn: true,
	changelog: true
}).extend({
	platformsCondensed: z.record(z.iso.date(), z.array(PLATFORM.shape.name))
});

export interface ImportRelease extends z.infer<typeof IMPORT_RELEASE> {}

export const IMPORT_RELEASES = z.array(IMPORT_RELEASE);

export interface ImportReleases extends z.infer<typeof IMPORT_RELEASES> {}
