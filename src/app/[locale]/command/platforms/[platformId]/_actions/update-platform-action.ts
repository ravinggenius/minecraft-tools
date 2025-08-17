import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as platformModel from "@/domains/platform/model";
import { Platform, PLATFORM_ATTRS } from "@/domains/platform/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const updatePlatformAction =
	(platformId: Platform["id"]): ServerAction =>
	async (data) => {
		"use server";

		await enforceAuthorization(["update", "any", "platform"]);

		const locale = await extractLocaleFromRequest();

		const result = await normalizeFormData(PLATFORM_ATTRS, data);

		if (!result.success) {
			return { issues: result.error.issues };
		}

		try {
			const updatedPlatform = await platformModel.update(
				platformId,
				result.data
			);

			revalidatePath(`/${locale}/command/platforms`);
			revalidatePath(
				`/${locale}/command/platforms/${updatedPlatform.id}`
			);
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

export default updatePlatformAction;
