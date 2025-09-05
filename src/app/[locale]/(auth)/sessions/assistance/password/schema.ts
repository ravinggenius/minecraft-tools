import { z } from "zod/v4";

import { ACCOUNT, ACCOUNT_PASSWORD_ATTRS } from "@/domains/account/schema";

export const QUERY = z.object({
	email: ACCOUNT.shape.email,
	token: z.string()
});

export type Query = z.infer<typeof QUERY>;

export const DATA = QUERY.merge(ACCOUNT_PASSWORD_ATTRS);

export const TOKEN = z.object({
	email: z.email(),
	nonce: z.string(),
	expiresAt: z.coerce.date()
});
