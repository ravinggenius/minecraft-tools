import { z } from "zod";

import { ACCOUNT, ACCOUNT_PASSWORD_ATTRS } from "@/library/account/schema";

export const QUERY = z.object({
	email: ACCOUNT.shape.email,
	token: z.string()
});

export interface Query extends z.infer<typeof QUERY> {}

export const DATA = QUERY.merge(ACCOUNT_PASSWORD_ATTRS);

export const TOKEN = z.object({
	email: z.string().email(),
	nonce: z.string(),
	expiresAt: z.coerce.date()
});
