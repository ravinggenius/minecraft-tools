import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

export const GET = async (
	request: NextRequest,
	{ params }: RouteContext<"/[locale]/sessions/assistance">
) => {
	const { locale } = await ensureParams(PARAMS, params);

	redirect(`/${locale}/sessions/new`);
};
