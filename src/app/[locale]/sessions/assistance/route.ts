import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import {
	ensureParams,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

export const GET = async (
	request: NextRequest,
	{ params }: Pick<PageProps, "params">
) => {
	const { locale } = await ensureParams(PARAMS, params);

	redirect(`/${locale}/sessions/new`);
};
