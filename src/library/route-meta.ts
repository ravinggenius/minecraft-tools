import { notFound } from "next/navigation";
import { z, ZodSchema } from "zod";

import { SUPPORTED_LOCALES } from "@/i18n/settings";

import CodedError, { ERROR_CODE } from "./coded-error";
import { PageProps } from "./route-meta.schema";

export const ensureParams = async <T>(
	schema: ZodSchema<T>,
	rawParams: PageProps["params"]
) => {
	const reply = await schema.safeParseAsync(rawParams);

	if (reply.success) {
		return reply.data;
	} else {
		notFound();
	}
};

export const ensureSearchParams = async <T>(
	schema: ZodSchema<T>,
	rawSearchParams: PageProps["searchParams"]
) => {
	const reply = await schema.safeParseAsync(rawSearchParams);

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
