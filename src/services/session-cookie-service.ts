import { cookies } from "next/headers";

import * as config from "@/library/_/config.mjs";
import { Session } from "@/library/session/schema";

import * as secretService from "./secret-service";

export const write = async (payload: string, expiresAt: Date) =>
	cookies().set(config.sessionName, await secretService.encrypt(payload), {
		...config.sessionCookieOptions,
		expires: expiresAt
	});

export const read = async () => {
	const token = cookies().get(config.sessionName)?.value;

	return token
		? await (secretService.decrypt(token) as Promise<Session["id"]>)
		: undefined;
};

export const clear = () => cookies().delete(config.sessionName);
