import { z } from "zod/v4";

export const ITEM_IDENTITY = z.object({
	id: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	identifier: z.string(),
	variant: z.string().nullish(),
	isVariant: z.boolean().readonly()
});

export type ItemIdentity = z.infer<typeof ITEM_IDENTITY>;

export const ITEM_IDENTITY_ATTRS = ITEM_IDENTITY.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isVariant: true
});

export type ItemIdentityAttrs = z.infer<typeof ITEM_IDENTITY_ATTRS>;
