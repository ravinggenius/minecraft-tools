import { z } from "zod/v4";

export const PROFILE = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	name: z.string().trim().min(2),
	isWelcomeNeeded: z.boolean()
});

export type Profile = z.infer<typeof PROFILE>;

export const PROFILE_ATTRS = PROFILE.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isWelcomeNeeded: true
});

export type ProfileAttrs = z.infer<typeof PROFILE_ATTRS>;

export const PUBLIC_PROFILE = PROFILE.omit({
	createdAt: true,
	updatedAt: true,
	isWelcomeNeeded: true
});

export type PublicProfile = z.infer<typeof PUBLIC_PROFILE>;
