import { Params } from "next/dist/server/request/params";
import { SearchParams } from "next/dist/server/request/search-params";
import { notFound } from "next/navigation";
import { z, ZodType } from "zod/v4";

import { SUPPORTED_LOCALES } from "@/i18n/settings";

import CodedError, { ERROR_CODE } from "./coded-error";

export const ensureParams = async <T>(
	schema: ZodType<T>,
	rawParams: Promise<Params> | undefined
) => {
	const reply = await schema.safeParseAsync(await rawParams);

	if (reply.success) {
		return reply.data;
	} else {
		notFound();
	}
};

export const ensureSearchParams = async <T>(
	schema: ZodType<T>,
	rawSearchParams: Promise<SearchParams> | undefined
) => {
	const reply = await schema.safeParseAsync(await rawSearchParams);

	if (reply.success) {
		return reply.data;
	} else {
		throw new CodedError(ERROR_CODE.SEARCH_QUERY_INVALID, {
			cause: reply.error
		});
	}
};

export const LOCALE_PARAMS = z.object({
	locale: z.enum(SUPPORTED_LOCALES)
});
