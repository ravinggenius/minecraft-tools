import trim from "cool-trim";
import { createPool, Interceptor, sql } from "slonik";
import { createQueryLoggingInterceptor } from "slonik-interceptor-query-logging";
import { createQueryNormalisationInterceptor } from "slonik-interceptor-query-normalisation";
import { z } from "zod";

import * as config from "./config.mjs";

const createQueryTrimInterceptor = () =>
	({
		transformQuery: (_context, query) => ({
			...query,
			sql: trim(query.sql)
		})
	}) satisfies Interceptor;

export const pool = createPool(config.databaseUrl, {
	captureStackTrace: true,
	interceptors: [
		config.isProduction
			? createQueryNormalisationInterceptor()
			: createQueryTrimInterceptor(),
		createQueryLoggingInterceptor()
	]
});

export { sql };

export const BOOLEAN_NAMED = (name: string) =>
	z.object({
		[name]: z.boolean()
	});

export const VOID = z.object({}).strict();
