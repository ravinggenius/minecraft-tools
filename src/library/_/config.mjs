import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export * from "./config-public.mjs";

const env = createEnv({
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		PASSWORD_SALT_ROUNDS: process.env.PASSWORD_SALT_ROUNDS,
		SESSION_COOKIE_MAX_AGE_SECONDS:
			process.env.SESSION_COOKIE_MAX_AGE_SECONDS
	},
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z.union([
			z.literal("development"),
			z.literal("production"),
			z.literal("test")
		]),
		PASSWORD_SALT_ROUNDS: z
			.string()
			.transform((n) => Number.parseInt(n, 10))
			.pipe(z.number().positive()),
		SESSION_COOKIE_MAX_AGE_SECONDS: z
			.string()
			.transform((n) => Number.parseInt(n, 10))
			.pipe(z.number().positive())
	}
});

export const isDevelopment = env.NODE_ENV === "development";

export const isProduction = env.NODE_ENV === "production";

export const isTest = env.NODE_ENV === "test";

/**
 * Postgres database connection URL. Can point to a connection pool
 */
export const databaseUrl = env.DATABASE_URL;

export const passwordSaltRounds = env.PASSWORD_SALT_ROUNDS;

export const sessionCookie = {
	maxAgeSeconds: env.SESSION_COOKIE_MAX_AGE_SECONDS
};
