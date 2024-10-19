import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { ReactNode } from "react";
import { z, ZodSchema } from "zod";

import { SUPPORTED_LOCALES } from "@/i18n/settings";

import CodedError, { ERROR_CODE } from "./coded-error";

type Params = { [key: string]: string | Array<string> };

export interface DefaultProps {
	params?: Params;
}

export interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export interface LayoutProps {
	children: ReactNode;
	params?: Params;
}

export type LayoutGenerateMetadata = (
	props: Pick<LayoutProps, "params">
) => Metadata | Promise<Metadata>;

export interface PageProps {
	params?: Params;
	searchParams?: { [key: string]: string | Array<string> | undefined };
}

export type PageGenerateMetadata = (
	props: PageProps
) => Metadata | Promise<Metadata>;

interface RouteContext {
	params: Params;
}

export type RouteMethod = (
	request: NextRequest,
	{ params }: RouteContext
) => Promise<Response>;

export interface TemplateProps {
	children: ReactNode;
}

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
