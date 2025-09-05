import { z } from "zod/v4";

export const DATA = z.object({
	email: z.email(),
	token: z.string()
});

export const TOKEN = z.object({
	email: z.email(),
	nonce: z.string(),
	expiresAt: z.iso.date()
});
