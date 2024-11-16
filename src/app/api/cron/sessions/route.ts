import * as sessionModel from "@/domains/session/model";
import { RouteMethod } from "@/library/route-meta.schema";

export const GET: RouteMethod = async (request, { params }) => {
	await sessionModel.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
