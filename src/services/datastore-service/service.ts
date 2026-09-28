import camelCase from "camelcase";
import dedent from "dedent";
import {
	createPool,
	Interceptor,
	QueryResultRow,
	SchemaValidationError,
	sql
} from "slonik";
import { createQueryLoggingInterceptor } from "slonik-interceptor-query-logging";
import { createQueryNormalisationInterceptor } from "slonik-interceptor-query-normalisation";

import * as config from "../config-service/service";

const normalizeKeys = (excludeKeyPattern: RegExp, data: unknown) => {
	if (Array.isArray(data)) {
		return data.map<unknown>((d): unknown =>
			normalizeKeys(excludeKeyPattern, d)
		);
	}

	if (data && typeof data === "object") {
		return Object.entries(data).reduce(
			(memo, [k, v]): Record<string, unknown> => ({
				...memo,
				[camelCase(k)]: excludeKeyPattern.test(k)
					? v
					: normalizeKeys(excludeKeyPattern, v)
			}),
			{}
		);
	}

	return data;
};

const createFieldNameInterceptor = (excludeKeyPattern: RegExp) =>
	({
		name: "app-field-name-interceptor",
		transformRow: (_context, _query, row, _fields) =>
			normalizeKeys(excludeKeyPattern, row) as QueryResultRow
	}) satisfies Interceptor;

const createQueryTrimInterceptor = () =>
	({
		name: "app-query-trim-interceptor",
		transformQuery: (_context, query) => ({
			...query,
			sql: dedent(query.sql)
		})
	}) satisfies Interceptor;

const createResultParserInterceptor = () =>
	({
		name: "runtime-zod-validation-interceptor",
		transformRowAsync: async (context, query, row) => {
			const { log, resultParser } = context;

			if (!resultParser) {
				return row;
			}

			const reply = await resultParser["~standard"].validate(row);

			if (reply.issues) {
				throw new SchemaValidationError(query, row, reply.issues);
			}

			return reply.value as QueryResultRow;
		}
	}) satisfies Interceptor;

export const pool = createPool(config.databaseUrl, {
	captureStackTrace: config.databaseStackTrace,
	interceptors: [
		createFieldNameInterceptor(/^(?:raw_\w+)|(?:all_raw_\w+)$/),
		createResultParserInterceptor(),
		config.isProduction
			? createQueryNormalisationInterceptor()
			: createQueryTrimInterceptor(),
		createQueryLoggingInterceptor()
	]
});

export { sql };
