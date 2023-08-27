import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export * from "./config-public.mjs";

const env = createEnv({
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		PASSWORD_SALT_ROUNDS: process.env.PASSWORD_SALT_ROUNDS,
		SESSION_COOKIE_PATH: process.env.SESSION_COOKIE_PATH,
		SESSION_COOKIE_SAME_SITE: process.env.SESSION_COOKIE_SAME_SITE,
		SESSION_MAX_AGE_SECONDS: process.env.SESSION_MAX_AGE_SECONDS,
		SESSION_NAME: process.env.SESSION_NAME,
		SESSION_SECRET: process.env.SESSION_SECRET
	},
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z.enum(["development", "production", "test"]),
		PASSWORD_SALT_ROUNDS: z
			.string()
			.transform((n) => Number.parseInt(n, 10))
			.pipe(z.number().positive()),
		SESSION_COOKIE_PATH: z.string().refine((path) => path.startsWith("/")),
		SESSION_COOKIE_SAME_SITE: z.enum(["lax", "none", "strict"]),
		SESSION_MAX_AGE_SECONDS: z
			.string()
			.transform((n) => Number.parseInt(n, 10))
			.pipe(z.number().positive()),
		SESSION_NAME: z.string(),
		SESSION_SECRET: z.string().min(32)
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

export const sessionCookieOptions = {
	httpOnly: true,
	path: env.SESSION_COOKIE_PATH,
	sameSite: env.SESSION_COOKIE_SAME_SITE,
	secure: isProduction
};

export const sessionMaxAgeSeconds = env.SESSION_MAX_AGE_SECONDS;

export const sessionName = env.SESSION_NAME;

export const sessionSecret = env.SESSION_SECRET;
