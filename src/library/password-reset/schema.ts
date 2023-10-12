import { parseJSON } from "date-fns";
import { z } from "zod";

import { ACCOUNT, ACCOUNT_PASSWORD_ATTRS } from "../account/schema";

export const PASSWORD_RESET = z.object({
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
	email: ACCOUNT.shape.email,
	nonce: z.string()
});

export interface PasswordReset extends z.infer<typeof PASSWORD_RESET> {}

export const PASSWORD_RESET_RESET_ATTRS = PASSWORD_RESET.pick({
	email: true,
	nonce: true
}).merge(ACCOUNT_PASSWORD_ATTRS);

export interface PasswordResetResetAttrs
	extends z.infer<typeof PASSWORD_RESET_RESET_ATTRS> {}
