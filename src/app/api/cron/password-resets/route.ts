import * as passwordReset from "@/domains/password-reset/model";
import { RouteMethod } from "@/library/route-meta.schema";

export const GET: RouteMethod = async (request, { params }) => {
	await passwordReset.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
