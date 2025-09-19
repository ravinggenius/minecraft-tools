import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as releaseCycleModel from "@/domains/release-cycle/model";
import { RELEASE_CYCLE_ATTRS } from "@/domains/release-cycle/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const createReleaseCycleAction: ServerAction = async (data) => {
	"use server";

	await enforceAuthorization(["create", "new", "release-cycle"]);

	const locale = await extractLocaleFromRequest();

	const result = await normalizeFormData(RELEASE_CYCLE_ATTRS, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	try {
		await releaseCycleModel.create(result.data);

		revalidatePath(`/${locale}/command/release-cycles`);
	} catch (error: unknown) {
		if (error instanceof CodedError) {
			return error.toJson();
		} else if (error instanceof ZodError) {
			return { issues: error.issues };
		} else {
			throw error;
		}
	}

	redirect(`/${locale}/command/release-cycles`);
};

export default createReleaseCycleAction;
