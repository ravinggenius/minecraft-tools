import { Metadata } from "next";
import { Params } from "next/dist/server/request/params";
import { SearchParams } from "next/dist/server/request/search-params";
import { NextRequest } from "next/server";
import { ReactNode } from "react";

export interface DefaultProps {
	params?: Promise<Params>;
}

export interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export interface LayoutProps {
	children: ReactNode;
	params?: Promise<Params>;
}

export type LayoutGenerateMetadata = (
	props: Pick<LayoutProps, "params">
) => Metadata | Promise<Metadata>;

export interface PageProps {
	params?: Promise<Params>;
	searchParams?: Promise<SearchParams>;
}

export type PageGenerateMetadata = (
	props: PageProps
) => Metadata | Promise<Metadata>;

interface RouteContext {
	params: Promise<Params>;
}

export type RouteMethod = (
	request: NextRequest,
	{ params }: RouteContext
) => Promise<Response>;

export interface TemplateProps {
	children: ReactNode;
}
