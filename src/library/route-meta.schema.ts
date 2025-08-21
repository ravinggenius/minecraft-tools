import { Params } from "next/dist/server/request/params";
import { ReactNode } from "react";

export interface DefaultProps {
	params?: Promise<Params>;
}

export interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export interface TemplateProps {
	children: ReactNode;
}
