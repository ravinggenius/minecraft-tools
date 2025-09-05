import { z } from "zod/v4";

import { ACCOUNT } from "../account/schema";

export const SESSION = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	expiresAt: z.coerce.date(),
	accountId: ACCOUNT.shape.id
});

export type Session = z.infer<typeof SESSION>;

export const SESSION_CREDENTIALS = ACCOUNT.pick({
	email: true
}).extend({
	password: z.string().min(1)
});

export type SessionCredentials = z.infer<typeof SESSION_CREDENTIALS>;
