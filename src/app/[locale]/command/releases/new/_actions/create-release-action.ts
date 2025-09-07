import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as releaseModel from "@/domains/release/model";
import { RELEASE_ATTRS } from "@/domains/release/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const createRelease: ServerAction = async (data) => {
	"use server";

	await enforceAuthorization(["create", "new", "release"]);

	const locale = await extractLocaleFromRequest();

	const result = await normalizeFormData(RELEASE_ATTRS, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	try {
		await releaseModel.create(result.data);

		revalidatePath(`/${locale}/compendium/releases`);
		revalidatePath(`/${locale}/command/releases`);
	} catch (error: unknown) {
		if (error instanceof CodedError) {
			return error.toJson();
		} else if (error instanceof ZodError) {
			return { issues: error.issues };
		} else {
			throw error;
		}
	}

	redirect(`/${locale}/command/releases`);
};

export default createRelease;
