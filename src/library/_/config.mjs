import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export * from "./config-public.mjs";

const env = createEnv({
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL
	},
	server: { DATABASE_URL: z.string().url() }
});

/**
 * Postgres database connection URL. Can point to a connection pool
 */
export const databaseUrl = env.DATABASE_URL;
