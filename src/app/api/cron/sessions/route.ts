import { unstable_noStore } from "next/cache";

import * as sessionModel from "@/library/session/model";

export const GET = async (request: Request) => {
	unstable_noStore();

	await sessionModel.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
