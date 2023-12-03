import * as passwordReset from "@/library/password-reset/model";
import * as sessionModel from "@/library/session/model";

export const GET = async (request: Request) => {
	await Promise.allSettled([
		passwordReset.clearExpired(),
		sessionModel.clearExpired()
	]);

	return new Response(undefined, {
		status: 204
	});
};
