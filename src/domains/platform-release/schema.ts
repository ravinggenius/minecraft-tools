import { z } from "zod/v4";

import { PLATFORM } from "../platform/schema";
import { RELEASE } from "../release/schema";

export const PLATFORM_RELEASE = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	platformId: PLATFORM.shape.id,
	releaseId: RELEASE.shape.id,
	releasedOn: z.coerce.date()
});

export interface PlatformRelease extends z.infer<typeof PLATFORM_RELEASE> {}

export const PLATFORM_RELEASE_ATTRS = PLATFORM_RELEASE.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export interface PlatformReleaseAttrs
	extends z.infer<typeof PLATFORM_RELEASE_ATTRS> {}
