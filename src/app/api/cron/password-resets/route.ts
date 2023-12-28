import * as passwordReset from "@/library/password-reset/model";

export const GET = async (request: Request) => {
	await passwordReset.clearExpired();

	return new Response(undefined, {
		status: 204
	});
};
