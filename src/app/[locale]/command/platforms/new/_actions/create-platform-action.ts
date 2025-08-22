import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as platformModel from "@/domains/platform/model";
import { PLATFORM_ATTRS } from "@/domains/platform/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const createPlatformAction: ServerAction = async (data) => {
	"use server";

	await enforceAuthorization(["create", "new", "platform"]);

	const locale = await extractLocaleFromRequest();

	const result = await normalizeFormData(PLATFORM_ATTRS, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	try {
		await platformModel.create(result.data);

		revalidatePath(`/${locale}/command/platforms`);
	} catch (error: unknown) {
		if (error instanceof CodedError) {
			return error.toJson();
		} else if (error instanceof ZodError) {
			return { issues: error.issues };
		} else {
			throw error;
		}
	}

	redirect(`/${locale}/command/platforms`);
};

export default createPlatformAction;
