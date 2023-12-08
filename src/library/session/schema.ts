import { z } from "zod";

import { ACCOUNT, ACCOUNT_PASSWORD_ATTRS } from "../account/schema";

export const SESSION = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	expiresAt: z.coerce.date(),
	accountId: ACCOUNT.shape.id
});

export interface Session extends z.infer<typeof SESSION> {}

export const SESSION_CREDENTIALS = ACCOUNT.pick({
	email: true
}).extend({
	password: z.string().nonempty()
});

export interface SessionCredentials
	extends z.infer<typeof SESSION_CREDENTIALS> {}
