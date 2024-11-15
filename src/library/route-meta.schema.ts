import { Metadata } from "next";
import { NextRequest } from "next/server";
import { ReactNode } from "react";

type Params = { [key: string]: string | Array<string> };
type SearchParams = { [key: string]: string | Array<string> | undefined };

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
	searchParams?: SearchParams;
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
