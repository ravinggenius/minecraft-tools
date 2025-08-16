import { cookies } from "next/headers";

import * as config from "../config-service/service";
import * as secretService from "../secret-service/service";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const write = async (payload: string, expiresAt: Date) =>
	(await cookies()).set(
		config.sessionName,
		await secretService.encrypt(payload),
		{
			...config.sessionCookieOptions,
			expires: expiresAt
		}
	);

export const read = async () => {
	const token = (await cookies()).get(config.sessionName)?.value;

	return token
		? await (secretService.decrypt(token) as Promise<string>)
		: undefined;
};

export const clear = async () => (await cookies()).delete(config.sessionName);
