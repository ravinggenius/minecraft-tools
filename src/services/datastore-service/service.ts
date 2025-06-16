import dedent from "dedent";
import { createPool, Interceptor, sql } from "slonik";
import { createQueryLoggingInterceptor } from "slonik-interceptor-query-logging";
import { createQueryNormalisationInterceptor } from "slonik-interceptor-query-normalisation";

import * as config from "../config-service/service.mjs";

const createQueryTrimInterceptor = () =>
	({
		name: "app-query-trim-interceptor",
		transformQuery: (_context, query) => ({
			...query,
			sql: dedent(query.sql)
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
