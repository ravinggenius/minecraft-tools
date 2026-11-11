import { z } from "zod/v4";

export const ITEM_RARITY = z.object({
	id: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	identifier: z.string()
});

export type ItemRarity = z.infer<typeof ITEM_RARITY>;

export const ITEM_RARITY_ATTRS = ITEM_RARITY.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type ItemRarityAttrs = z.infer<typeof ITEM_RARITY_ATTRS>;
