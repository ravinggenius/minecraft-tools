import Iron from "@hapi/iron";

import * as config from "@/library/_/config.mjs";

export const encrypt = (payload: unknown) =>
	Iron.seal(payload, config.sessionSecret, Iron.defaults);

export const decrypt = (payloadRaw: string) =>
	Iron.unseal(
		payloadRaw,
		config.sessionSecret,
		Iron.defaults
	) as Promise<unknown>;
