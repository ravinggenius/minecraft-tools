import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export * from "./config-public.mjs";

const env = createEnv({
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
		EMAIL_AUTH_USERNAME: process.env.EMAIL_AUTH_USERNAME,
		EMAIL_AUTH_PASSWORD: process.env.EMAIL_AUTH_PASSWORD,
		EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
		EMAIL_HOST: process.env.EMAIL_HOST,
		EMAIL_PORT: process.env.EMAIL_PORT,
		EMAIL_SECURE: process.env.EMAIL_SECURE,
		EMAIL_VERIFICATION_EXPIRY_DAYS:
			process.env.EMAIL_VERIFICATION_EXPIRY_DAYS,
		EMAIL_VERIFICATION_REMINDER_EXPIRY_MINUTES:
			process.env.EMAIL_VERIFICATION_REMINDER_EXPIRY_MINUTES,
		ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
		HOST_URL: process.env.HOST_URL,
		NODE_ENV: process.env.NODE_ENV,
		PASSWORD_SALT_ROUNDS: process.env.PASSWORD_SALT_ROUNDS,
		SESSION_COOKIE_PATH: process.env.SESSION_COOKIE_PATH,
		SESSION_COOKIE_SAME_SITE: process.env.SESSION_COOKIE_SAME_SITE,
		SESSION_MAX_AGE_SECONDS: process.env.SESSION_MAX_AGE_SECONDS,
		SESSION_NAME: process.env.SESSION_NAME
	},
	server: {
		DATABASE_URL: z.string().url(),
		EMAIL_AUTH_USERNAME: z.string(),
		EMAIL_AUTH_PASSWORD: z.string(),
		EMAIL_FROM_ADDRESS: z.string().email(),
		EMAIL_HOST: z.string(),
		EMAIL_PORT: z
			.string()
			.transform((n) => Number.parseInt(n, 10))
			.pipe(z.number().min(1).max(65535)),
		EMAIL_SECURE: z
			.string()
			.refine((s) => s === "true" || s === "false")
			.transform((s) => s === "true"),
		EMAIL_VERIFICATION_EXPIRY_DAYS: z
			.string()
			.transform((n) => Number.parseInt(n, 10)),
		EMAIL_VERIFICATION_REMINDER_EXPIRY_MINUTES: z
			.string()
			.transform((n) => Number.parseInt(n, 10))
			.pipe(z.number().positive()),
		ENCRYPTION_SECRET: z.string().min(32),
		HOST_URL: z.string().url(),
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
		SESSION_NAME: z.string()
	}
});

export const isDevelopment = env.NODE_ENV === "development";

export const isProduction = env.NODE_ENV === "production";

export const isTest = env.NODE_ENV === "test";

/**
 * Postgres database connection URL. Can point to a connection pool
 */
export const databaseUrl = env.DATABASE_URL;

export const email = {
	auth: {
		username: env.EMAIL_AUTH_USERNAME,
		password: env.EMAIL_AUTH_PASSWORD
	},
	from: {
		address: env.EMAIL_FROM_ADDRESS
	},
	host: env.EMAIL_HOST,
	port: env.EMAIL_PORT,
	secure: env.EMAIL_SECURE
};

export const emailVerificationExpiryDays = env.EMAIL_VERIFICATION_EXPIRY_DAYS;
export const emailVerificationReminderExpiryMinutes =
	env.EMAIL_VERIFICATION_REMINDER_EXPIRY_MINUTES;

export const encryptionSecret = env.ENCRYPTION_SECRET;

export const hostUrl = env.HOST_URL;

export const passwordSaltRounds = env.PASSWORD_SALT_ROUNDS;

export const sessionCookieOptions = {
	httpOnly: true,
	path: env.SESSION_COOKIE_PATH,
	sameSite: env.SESSION_COOKIE_SAME_SITE,
	secure: isProduction
};

export const sessionMaxAgeSeconds = env.SESSION_MAX_AGE_SECONDS;

export const sessionName = env.SESSION_NAME;
