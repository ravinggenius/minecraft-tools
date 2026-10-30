import { z } from "zod/v4";

export const ITEM = z.object({
	id: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	identifier: z.string(),
	variant: z.string().nullish(),
	isVariant: z.boolean().readonly()
});

export type Item = z.infer<typeof ITEM>;

export const ITEM_ATTRS = ITEM.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isVariant: true
});

export type ItemAttrs = z.infer<typeof ITEM_ATTRS>;
