import { z } from "zod/v4";

import { RELEASE } from "../release/schema";

export const RARITY = z.enum(["common", "uncommon", "rare", "epic"]);

export const ITEM = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	identity: z.string(),
	wikiUrl: z.url(),
	rarity: RARITY.default("common").optional(),
	stackSize: z.int().positive().default(64).optional(),
	isRenewable: z.boolean()
});

export type Item = z.infer<typeof ITEM>;

export const ITEM_ATTRS = ITEM.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type ItemAttrs = z.infer<typeof ITEM_ATTRS>;

export const RELEASED_ITEM = ITEM.and(
	z.object({
		releaseId: RELEASE.shape.id
	})
)
	.and(
		RELEASE.pick({
			edition: true,
			version: true,
			isLatest: true
		})
	)
	.readonly();

export type ReleasedItem = z.infer<typeof RELEASED_ITEM>;
