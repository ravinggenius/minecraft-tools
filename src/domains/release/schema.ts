import { z } from "zod/v4";

import { PLATFORM } from "../platform/schema";

export const EDITION = z.enum(["bedrock", "java"]);

export type Edition = z.infer<typeof EDITION>;

export const RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	edition: EDITION,
	version: z.string(),
	name: z.string().optional(),
	developmentReleasedOn: z.coerce.date().optional(),
	changelog: z.url().optional(),
	isAvailableForTools: z.coerce.boolean(),
	isLatest: z.boolean().readonly()
});

export interface Release extends z.infer<typeof RELEASE> {}

export const RELEASE_ATTRS = RELEASE.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isLatest: true
});

export interface ReleaseAttrs extends z.infer<typeof RELEASE_ATTRS> {}

export const UPCOMING = z.literal("upcoming");

export const IMPORT_RELEASE = RELEASE.pick({
	edition: true,
	version: true,
	name: true,
	developmentReleasedOn: true,
	changelog: true
}).extend({
	platforms: z.record(
		z.union([z.iso.date(), UPCOMING]),
		z.array(PLATFORM.shape.name)
	)
});

export interface ImportRelease extends z.infer<typeof IMPORT_RELEASE> {}

export const IMPORT_RELEASES = z.array(IMPORT_RELEASE);

export interface ImportReleases extends z.infer<typeof IMPORT_RELEASES> {}
