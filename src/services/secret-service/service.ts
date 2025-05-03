import Iron from "@hapi/iron";
import { alphabet, generateRandomString } from "oslo/crypto";
import { Argon2id } from "oslo/password";

import * as config from "../config-service/service.mjs";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const encrypt = (payload: unknown) =>
	Iron.seal(payload, config.encryptionSecret, Iron.defaults);

export const decrypt = (payloadRaw: string) =>
	Iron.unseal(
		payloadRaw,
		config.encryptionSecret,
		Iron.defaults
	) as Promise<unknown>;

export const nonce = () =>
	generateRandomString(24, alphabet("a-z", "A-Z", "0-9"));

export const hash = async (password: string) => {
	const argon = new Argon2id();

	return argon.hash(password);
};

export const compare = async (password: string, hashword: string) => {
	const argon = new Argon2id();

	return argon.verify(hashword, password);
};
