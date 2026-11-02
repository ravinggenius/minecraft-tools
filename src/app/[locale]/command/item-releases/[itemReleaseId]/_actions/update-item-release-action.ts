import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemReleaseModel from "@/domains/item-release/model";
import { ITEM_RELEASE_ATTRS, ItemRelease } from "@/domains/item-release/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const updateItemReleaseAction =
	(itemReleaseId: ItemRelease["id"]): ServerAction =>
	async (data) => {
		"use server";

		await enforceAuthorization(["update", "any", "item-release"]);

		const locale = await extractLocaleFromRequest();

		const result = await normalizeFormData(ITEM_RELEASE_ATTRS, data);

		if (!result.success) {
			return { issues: result.error.issues };
		}

		try {
			await itemReleaseModel.update(itemReleaseId, result.data);

			revalidatePath(`/${locale}/command/item-releases`);
			revalidatePath(`/${locale}/command/item-releases/${itemReleaseId}`);
			revalidatePath(`/${locale}/compendium/items`);
		} catch (error: unknown) {
			if (error instanceof CodedError) {
				return error.toJson();
			} else if (error instanceof ZodError) {
				return { issues: error.issues };
			} else {
				throw error;
			}
		}

		redirect(`/${locale}/command/item-releases`);
	};

export default updateItemReleaseAction;
