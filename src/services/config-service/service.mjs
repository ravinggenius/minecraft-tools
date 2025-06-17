import { z } from "zod/v4";

export * from "./service-public.mjs";

/**
 * Postgres database connection URL. Can point to a connection pool
 */
export const databaseUrl = z.string().url().parse(process.env.DATABASE_URL);

export const email = {
	auth: {
		username: z.string().parse(process.env.EMAIL_AUTH_USERNAME),
		password: z.string().parse(process.env.EMAIL_AUTH_PASSWORD)
	},
	from: {
		address: z.string().email().parse(process.env.EMAIL_FROM_ADDRESS)
	},
	host: z.string().parse(process.env.EMAIL_HOST),
	port: z
		.string()
		.transform((n) => Number.parseInt(n, 10))
		.pipe(z.int().min(1).max(65535))
		.parse(process.env.EMAIL_PORT),
	secure: z
		.string()
		.refine((s) => s === "true" || s === "false")
		.transform((s) => s === "true")
		.parse(process.env.EMAIL_SECURE)
};

export const emailResendExpiryMinutes = z
	.string()
	.transform((n) => Number.parseInt(n, 10))
	.pipe(z.int().positive())
	.parse(process.env.EMAIL_RESEND_EXPIRY_MINUTES);

export const emailVerificationExpiryDays = z
	.string()
	.transform((n) => Number.parseInt(n, 10))
	.pipe(z.int().positive())
	.parse(process.env.EMAIL_VERIFICATION_EXPIRY_DAYS);

export const encryptionSecret = z
	.string()
	.min(32)
	.parse(process.env.ENCRYPTION_SECRET);

export const hostUrl = z.string().url().parse(process.env.HOST_URL);

export const nodeEnv = z
	.enum(["development", "production", "test"])
	.default("development")
	.parse(process.env.NODE_ENV);

export const isDevelopment = nodeEnv === "development";

export const isProduction = nodeEnv === "production";

export const isTest = nodeEnv === "test";

export const sessionCookieOptions = {
	httpOnly: true,
	path: z
		.string()
		.refine((path) => path.startsWith("/"))
		.parse(process.env.SESSION_COOKIE_PATH),
	sameSite: z
		.enum(["lax", "none", "strict"])
		.parse(process.env.SESSION_COOKIE_SAME_SITE),
	secure: isProduction
};

export const sessionMaxAgeSeconds = z
	.string()
	.transform((n) => Number.parseInt(n, 10))
	.pipe(z.int().positive())
	.parse(process.env.SESSION_MAX_AGE_SECONDS);

export const sessionName = z.string().parse(process.env.SESSION_NAME);

export const sessionAssistancePasswordResetExpiryMinutes = z
	.string()
	.transform((n) => Number.parseInt(n, 10))
	.pipe(z.int().positive())
	.parse(process.env.SESSION_ASSISTANCE_PASSWORD_RESET_EXPIRY_MINUTES);
