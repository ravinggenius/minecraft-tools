import { z } from "zod";

export const EDITION = z.enum(["bedrock", "java"]);

export const VERSION = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	edition: EDITION,
	version: z.string(),
	cycle: z.tuple([z.number().nonnegative(), z.number().nonnegative()]),
	releasedOn: z.coerce.date(),
	releaseNotesUrl: z.string().url(),
	isPublished: z.boolean().default(false).optional()
});

export interface Version extends z.infer<typeof VERSION> {}

export const VERSION_ATTRS = VERSION.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export interface VersionAttrs extends z.infer<typeof VERSION_ATTRS> {}

export const LATEST_VERSION = VERSION.extend({
	isLatest: z.boolean(),
	isLatestInCycle: z.boolean()
});

export interface LatestVersion extends z.infer<typeof LATEST_VERSION> {}
