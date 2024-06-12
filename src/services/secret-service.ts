import Iron from "@hapi/iron";
import bcrypt from "bcrypt";
import crypto from "crypto";

import * as config from "./config-service.mjs";

export const encrypt = (payload: unknown) =>
	Iron.seal(payload, config.encryptionSecret, Iron.defaults);

export const decrypt = (payloadRaw: string) =>
	Iron.unseal(
		payloadRaw,
		config.encryptionSecret,
		Iron.defaults
	) as Promise<unknown>;

export const nonce = () => crypto.randomBytes(16).toString("base64");

export const hash = async (password: string) =>
	bcrypt.hash(password, config.passwordSaltRounds);

export const compare = async (password: string, hashword: string) =>
	bcrypt.compare(password, hashword);
