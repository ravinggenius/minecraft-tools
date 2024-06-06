import { cookies } from "next/headers";

import * as config from "./config-service.mjs";
import * as secretService from "./secret-service";

export const write = async (payload: string, expiresAt: Date) =>
	cookies().set(config.sessionName, await secretService.encrypt(payload), {
		...config.sessionCookieOptions,
		expires: expiresAt
	});

export const read = async () => {
	const token = cookies().get(config.sessionName)?.value;

	return token
		? await (secretService.decrypt(token) as Promise<string>)
		: undefined;
};

export const clear = () => cookies().delete(config.sessionName);
