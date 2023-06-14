import { parseJSON } from "date-fns";
import { z } from "zod";

export const PROFILE = z.object({
	id: z.string().uuid(),
	createdAt: z
		.string()
		.transform(parseJSON)
		.refine(
			(ts) => ts instanceof Date && ts.valueOf() > 0,
			"must be a valid date"
		),
	updatedAt: z
		.string()
		.transform(parseJSON)
		.refine(
			(ts) => ts instanceof Date && ts.valueOf() > 0,
			"must be a valid date"
		),
	name: z.string().trim().min(2)
});

export interface Profile extends z.infer<typeof PROFILE> {}

export const PROFILE_ATTRS = PROFILE.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export interface ProfileAttrs extends z.infer<typeof PROFILE_ATTRS> {}

export const PUBLIC_PROFILE = PROFILE.omit({
	createdAt: true,
	updatedAt: true
});

export interface PublicProfile extends z.infer<typeof PUBLIC_PROFILE> {}
