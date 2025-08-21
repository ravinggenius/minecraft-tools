import { NextRequest } from "next/server";

import * as passwordReset from "@/domains/password-reset/model";

export const GET = async (
	request: NextRequest,
	{ params }: RouteContext<"/api/cron/password-resets">
) => {
	await passwordReset.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
