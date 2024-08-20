import { unstable_noStore } from "next/cache";

import * as passwordReset from "@/domains/password-reset/model";

export const GET = async (request: Request) => {
	unstable_noStore();

	await passwordReset.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
