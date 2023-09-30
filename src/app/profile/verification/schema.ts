import { parseJSON } from "date-fns";
import { z } from "zod";

export const DATA = z.object({
	email: z.string().email(),
	token: z.string()
});

export const TOKEN = z.object({
	email: z.string().email(),
	nonce: z.string(),
	expiresAt: z
		.string()
		.datetime()
		.transform(parseJSON)
		.refine(
			(ts) => ts instanceof Date && ts.valueOf() > 0,
			"must be a valid date"
		)
});
