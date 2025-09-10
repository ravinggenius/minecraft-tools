import { z } from "zod/v4";

import { ACCOUNT, ACCOUNT_PASSWORD_ATTRS } from "../account/schema";

export const PASSWORD_RESET = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	expiresAt: z.iso.date(),
	email: ACCOUNT.shape.email,
	nonce: z.string()
});

export type PasswordReset = z.infer<typeof PASSWORD_RESET>;

export const PASSWORD_RESET_RESET_ATTRS = PASSWORD_RESET.pick({
	email: true,
	nonce: true
}).merge(ACCOUNT_PASSWORD_ATTRS);

export type PasswordResetResetAttrs = z.infer<
	typeof PASSWORD_RESET_RESET_ATTRS
>;
