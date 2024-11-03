import { redirect } from "next/navigation";

import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { RouteMethod } from "@/library/route-meta.schema";

export const GET: RouteMethod = async (request, { params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	redirect(`/${locale}/sessions/new`);
};
