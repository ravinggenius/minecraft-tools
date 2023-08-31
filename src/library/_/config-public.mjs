import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
	runtimeEnv: {
		NEXT_PUBLIC_PASSWORD_MIN_LENGTH:
			process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH
	},
	client: {
		NEXT_PUBLIC_PASSWORD_MIN_LENGTH: z
			.string()
			.transform((n) => Number.parseInt(n, 10))
			.pipe(z.number().positive())
	}
});

export const passwordMinLength = env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH;
