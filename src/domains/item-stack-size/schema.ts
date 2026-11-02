import { z } from "zod/v4";

export const ITEM_STACK_SIZE = z.object({
	id: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	identifier: z.int().positive()
});

export type ItemStackSize = z.infer<typeof ITEM_STACK_SIZE>;

export const ITEM_STACK_SIZE_ATTRS = ITEM_STACK_SIZE.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type ItemStackSizeAttrs = z.infer<typeof ITEM_STACK_SIZE_ATTRS>;
