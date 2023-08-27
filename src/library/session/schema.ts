import { parseJSON } from "date-fns";
import { z } from "zod";

import { ACCOUNT, ACCOUNT_PASSWORD_ATTRS } from "../account/schema";

export const SESSION = z.object({
	id: z.string().uuid(),
	createdAt: z
		.string()
		.transform(parseJSON)
		.refine(
			(ts) => ts instanceof Date && ts.valueOf() > 0,
			"must be a valid date"
		),
	updatedAt: z
		.string()
		.transform(parseJSON)
		.refine(
			(ts) => ts instanceof Date && ts.valueOf() > 0,
			"must be a valid date"
		),
	expiresAt: z
		.string()
		.transform(parseJSON)
		.refine(
			(ts) => ts instanceof Date && ts.valueOf() > 0,
			"must be a valid date"
		),
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
