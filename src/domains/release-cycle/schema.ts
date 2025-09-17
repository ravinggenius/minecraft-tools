import { z } from "zod/v4";

export const RELEASE_CYCLE = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	name: z.string()
});

export type ReleaseCycle = z.infer<typeof RELEASE_CYCLE>;

export const RELEASE_CYCLE_ATTRS = RELEASE_CYCLE.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type ReleaseCycleAttrs = z.infer<typeof RELEASE_CYCLE_ATTRS>;
