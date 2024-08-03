import { z } from "zod";

export const EDITION = z.enum(["bedrock", "java"]);

export const RELEASE = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	edition: EDITION,
	version: z.string(),
	cycle: z.tuple([z.number().nonnegative(), z.number().nonnegative()]),
	developmentReleasedOn: z.coerce.date().optional(),
	notesUrl: z.string().url().optional(),
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
