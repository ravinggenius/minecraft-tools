import { NextRequest } from "next/server";

import * as sessionModel from "@/domains/session/model";

export const GET = async (
	request: NextRequest,
	{ params }: RouteContext<"/api/cron/sessions">
) => {
	await sessionModel.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
