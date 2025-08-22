import { forbidden } from "next/navigation";
import { cache } from "react";
import { z } from "zod/v4";

import * as permissionModel from "@/domains/permission/model";
import { ASSERTION, AssertionTuple } from "@/domains/permission/schema";

import { maybeProfileFromSession } from "./session-manager";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

const ASSERTIONS = z.array(ASSERTION).min(1);

export const confirmAuthorization = cache(
	async (...assertions: [AssertionTuple, ...Array<AssertionTuple>]) => {
		const profile = await maybeProfileFromSession();

		if (!profile) {
			return false;
		}

		return permissionModel.mayContinue(
			profile.id,
			ASSERTIONS.parse(assertions)
		);
	}
);

export const enforceAuthorization = cache(
	async (...assertions: [AssertionTuple, ...Array<AssertionTuple>]) => {
		const mayContinue = await confirmAuthorization(...assertions);

		if (!mayContinue) {
			forbidden();
		}
	}
);
