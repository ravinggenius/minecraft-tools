import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export * from "./config-public.mjs";

const env = createEnv({
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV
	},
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z.union([
			z.literal("development"),
			z.literal("production"),
			z.literal("test")
		])
	}
});

export const isDevelopment = env.NODE_ENV === "development";

export const isProduction = env.NODE_ENV === "production";

export const isTest = env.NODE_ENV === "test";

/**
 * Postgres database connection URL. Can point to a connection pool
 */
export const databaseUrl = env.DATABASE_URL;
