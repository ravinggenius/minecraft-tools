import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
	runtimeEnv: {
		NEXT_PUBLIC_DEBUG_I18N: process.env.NEXT_PUBLIC_DEBUG_I18N,
		NEXT_PUBLIC_PASSWORD_MIN_LENGTH:
			process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH
	},
	client: {
		NEXT_PUBLIC_DEBUG_I18N: z
			.string()
			.refine((s) => s === "true" || s === "false")
			.transform((s) => s === "true"),
		NEXT_PUBLIC_PASSWORD_MIN_LENGTH: z
			.string()
			.transform((n) => Number.parseInt(n, 10))
			.pipe(z.number().positive())
	}
});

export const debugI18n = env.NEXT_PUBLIC_DEBUG_I18N;

export const passwordMinLength = env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH;
