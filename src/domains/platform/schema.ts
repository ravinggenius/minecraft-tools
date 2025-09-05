import { z } from "zod/v4";

export const PLATFORM = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	name: z.string()
});

export type Platform = z.infer<typeof PLATFORM>;

export const PLATFORM_ATTRS = PLATFORM.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type PlatformAttrs = z.infer<typeof PLATFORM_ATTRS>;
