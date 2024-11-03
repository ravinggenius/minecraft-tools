import { unstable_noStore } from "next/cache";

import * as sessionModel from "@/domains/session/model";
import { RouteMethod } from "@/library/route-meta.schema";

export const GET: RouteMethod = async (request, { params }) => {
	unstable_noStore();

	await sessionModel.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
