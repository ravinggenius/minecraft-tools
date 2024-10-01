import { redirect } from "next/navigation";

import {
	ensureParams,
	LOCALE_PARAMS as PARAMS,
	RouteMethod
} from "@/library/route-meta";

export const GET: RouteMethod = async (request, { params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	redirect(`/${locale}/profile`);
};
