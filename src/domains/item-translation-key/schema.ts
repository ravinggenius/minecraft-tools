import { z } from "zod/v4";

export const ITEM_TRANSLATION_KEY = z.object({
	id: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	identifier: z.string()
});

export type ItemTranslationKey = z.infer<typeof ITEM_TRANSLATION_KEY>;

export const ITEM_TRANSLATION_KEY_ATTRS = ITEM_TRANSLATION_KEY.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type ItemTranslationKeyAttrs = z.infer<
	typeof ITEM_TRANSLATION_KEY_ATTRS
>;
