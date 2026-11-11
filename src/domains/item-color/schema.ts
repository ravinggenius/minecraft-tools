import { z } from "zod/v4";

export const ITEM_COLOR = z.object({
	id: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	identifier: z.string()
});

export type ItemColor = z.infer<typeof ITEM_COLOR>;

export const ITEM_COLOR_ATTRS = ITEM_COLOR.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type ItemColorAttrs = z.infer<typeof ITEM_COLOR_ATTRS>;
