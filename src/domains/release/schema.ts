import { z } from "zod/v4";

export const EDITION = z.enum(["bedrock", "java"]);

export type Edition = z.infer<typeof EDITION>;

export const RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	edition: EDITION,
	version: z.string(),
	cycle: z.tuple([z.int().nonnegative(), z.int().nonnegative()]),
	developmentReleasedOn: z.coerce.date().optional(),
	notesUrl: z.url().optional(),
	isAvailableForTools: z.coerce.boolean(),
	isEarliestInCycle: z.boolean().readonly(),
	isLatestInCycle: z.boolean().readonly(),
	isLatest: z.boolean().readonly()
});

export interface Release extends z.infer<typeof RELEASE> {}

export const RELEASE_ATTRS = RELEASE.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isEarliestInCycle: true,
	isLatestInCycle: true,
	isLatest: true
});

export interface ReleaseAttrs extends z.infer<typeof RELEASE_ATTRS> {}

export const UPCOMING = z.literal("upcoming");

export const IMPORT_RELEASE = RELEASE.pick({
	edition: true,
	version: true,
	developmentReleasedOn: true,
	notesUrl: true
}).extend({
	platforms: z.record(z.union([z.iso.date(), UPCOMING]), z.array(z.string()))
});

export interface ImportRelease extends z.infer<typeof IMPORT_RELEASE> {}

export const IMPORT_RELEASES = z.array(IMPORT_RELEASE);

export interface ImportReleases extends z.infer<typeof IMPORT_RELEASES> {}
