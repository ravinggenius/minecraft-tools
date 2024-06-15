import { z } from "zod";

import { LATEST_VERSION } from "../version/schema";

export const RARITY = z.enum(["common", "uncommon", "rare", "epic"]);

export const ITEM = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	identity: z.string(),
	wikiUrl: z.string().url(),
	rarity: RARITY.default("common").optional(),
	stackSize: z.number().positive().default(64).optional(),
	isRenewable: z.boolean()
});

export interface Item extends z.infer<typeof ITEM> {}

export const ITEM_ATTRS = ITEM.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export interface ItemAttrs extends z.infer<typeof ITEM_ATTRS> {}

export const VERSIONED_ITEM = ITEM.and(
	z.object({
		versionId: LATEST_VERSION.shape.id
	})
).and(
	LATEST_VERSION.pick({
		edition: true,
		version: true,
		cycle: true,
		isLatest: true,
		isLatestInCycle: true
	})
);

export interface VersionedItem extends z.infer<typeof VERSIONED_ITEM> {}
