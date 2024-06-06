import Iron from "@hapi/iron";
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
