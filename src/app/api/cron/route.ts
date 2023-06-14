import * as sessionModel from "@/library/session/model";

export const POST = async (request: Request) => {
	await sessionModel.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
