import camelCase from "camelcase";
import dedent from "dedent";
import { createPool, Interceptor, QueryResultRow, sql } from "slonik";
import { createQueryLoggingInterceptor } from "slonik-interceptor-query-logging";
import { createQueryNormalisationInterceptor } from "slonik-interceptor-query-normalisation";

import * as config from "../config-service/service";

const normalizeKeys = (data: unknown) => {
	if (Array.isArray(data)) {
		return data.map<unknown>(normalizeKeys);
	}

	if (data && typeof data === "object") {
		return Object.entries(data).reduce(
			(memo, [k, v]): Record<string, unknown> => ({
				...memo,
				[camelCase(k)]: normalizeKeys(v)
			}),
			{}
		);
	}

	return data;
};

const createFieldNameInterceptor = () =>
	({
		name: "app-field-name-interceptor",
		transformRow: (_context, _query, row, _fields) =>
			normalizeKeys(row) as QueryResultRow
	}) satisfies Interceptor;

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
		createFieldNameInterceptor(),
		config.isProduction
			? createQueryNormalisationInterceptor()
			: createQueryTrimInterceptor(),
		createQueryLoggingInterceptor()
	]
});

export { sql };
