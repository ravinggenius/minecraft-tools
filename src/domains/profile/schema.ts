import { z } from "zod/v4";

export const PROFILE = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	name: z.string().trim().min(2),
	isWelcomeNeeded: z.boolean()
});

export interface Profile extends z.infer<typeof PROFILE> {}

export const PROFILE_ATTRS = PROFILE.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isWelcomeNeeded: true
});

export interface ProfileAttrs extends z.infer<typeof PROFILE_ATTRS> {}

export const PUBLIC_PROFILE = PROFILE.omit({
	createdAt: true,
	updatedAt: true,
	isWelcomeNeeded: true
});

export interface PublicProfile extends z.infer<typeof PUBLIC_PROFILE> {}
