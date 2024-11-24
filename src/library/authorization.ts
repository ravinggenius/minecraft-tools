import { forbidden } from "next/navigation";
import { z } from "zod";

import * as permissionModel from "@/domains/permission/model";
import { ASSERTION, AssertionTuple } from "@/domains/permission/schema";

import { maybeProfileFromSession } from "./session-manager";

const ASSERTIONS = z.array(ASSERTION).min(1);

export const confirmAuthorization = async (
	...assertions: [AssertionTuple, ...Array<AssertionTuple>]
) => {
	const profile = await maybeProfileFromSession();

	if (!profile) {
		return false;
	}

	return permissionModel.mayContinue(
		profile.id,
		ASSERTIONS.parse(assertions)
	);
};

export const enforceAuthorization = async (
	...assertions: [AssertionTuple, ...Array<AssertionTuple>]
) => {
	const mayContinue = await confirmAuthorization(...assertions);

	if (!mayContinue) {
		forbidden();
	}
};
