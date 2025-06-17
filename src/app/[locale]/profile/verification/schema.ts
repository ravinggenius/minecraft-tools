import { z } from "zod/v4";

export const DATA = z.object({
	email: z.string().email(),
	token: z.string()
});

export const TOKEN = z.object({
	email: z.string().email(),
	nonce: z.string(),
	expiresAt: z.coerce.date()
});
