import { z } from "zod/v4";

import { PLATFORM } from "../platform/schema";
import { RELEASE } from "../release/schema";

export const PLATFORM_RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	platformId: PLATFORM.shape.id,
	releaseId: RELEASE.shape.id,
	productionReleasedOn: z.coerce.date()
});

export type PlatformRelease = z.infer<typeof PLATFORM_RELEASE>;

export const PLATFORM_RELEASE_ATTRS = PLATFORM_RELEASE.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type PlatformReleaseAttrs = z.infer<typeof PLATFORM_RELEASE_ATTRS>;
