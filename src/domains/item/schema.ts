import { z } from "zod/v4";

import { ITEM_COLOR } from "../item-color/schema";
import { ITEM_IDENTITY } from "../item-identity/schema";
import { ITEM_RARITY } from "../item-rarity/schema";
import { ITEM_STACK_SIZE } from "../item-stack-size/schema";
import { ITEM_TRANSLATION_KEY } from "../item-translation-key/schema";

export const ITEM = z.object({
	id: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	itemIdentityId: ITEM_IDENTITY.shape.id,
	itemColorId: ITEM_COLOR.shape.id.nullish(),
	itemRarityId: ITEM_RARITY.shape.id,
	itemStackSizeId: ITEM_STACK_SIZE.shape.id,
	itemTranslationKeyId: ITEM_TRANSLATION_KEY.shape.id.nullish()
});

export type Item = z.infer<typeof ITEM>;

export const ITEM_ATTRS = ITEM.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type ItemAttrs = z.infer<typeof ITEM_ATTRS>;

export const NORMALIZED_ITEM = ITEM.extend({
	identifier: ITEM_IDENTITY.shape.identifier,
	variant: ITEM_IDENTITY.shape.variant,
	isVariant: ITEM_IDENTITY.shape.isVariant,
	color: ITEM_COLOR.shape.identifier.nullish(),
	rarity: ITEM_RARITY.shape.identifier,
	stackSize: ITEM_STACK_SIZE.shape.identifier,
	translationKey: ITEM_TRANSLATION_KEY.shape.identifier.nullish(),
	releasesCount: z.int().nonnegative()
});

export type NormalizedItem = Prettify<z.infer<typeof NORMALIZED_ITEM>>;
