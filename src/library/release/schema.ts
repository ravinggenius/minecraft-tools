import { z } from "zod";

export const EDITION = z.enum(["bedrock", "java"]);

export const RELEASE = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	edition: EDITION,
	version: z.string(),
	cycle: z.tuple([z.number().nonnegative(), z.number().nonnegative()]),
	releasedOn: z.coerce.date(),
	notesUrl: z.string().url(),
	isLatest: z.boolean().readonly(),
	isLatestInCycle: z.boolean().readonly()
});

export interface Release extends z.infer<typeof RELEASE> {}

export const RELEASE_ATTRS = RELEASE.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isLatest: true,
	isLatestInCycle: true
});

export interface ReleaseAttrs extends z.infer<typeof RELEASE_ATTRS> {}
