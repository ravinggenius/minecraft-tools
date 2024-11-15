import { unstable_noStore } from "next/cache";

import * as passwordReset from "@/domains/password-reset/model";
import { RouteMethod } from "@/library/route-meta.schema";

export const GET: RouteMethod = async (request, { params }) => {
	unstable_noStore();

	await passwordReset.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
