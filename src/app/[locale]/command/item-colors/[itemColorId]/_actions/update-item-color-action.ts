import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemColorModel from "@/domains/item-color/model";
import { ITEM_COLOR_ATTRS, ItemColor } from "@/domains/item-color/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const updateItemColorAction =
	(itemColorId: ItemColor["id"]): ServerAction =>
	async (data) => {
		"use server";

		await enforceAuthorization(["update", "any", "item-color"]);

		const locale = await extractLocaleFromRequest();

		const result = await normalizeFormData(ITEM_COLOR_ATTRS, data);

		if (!result.success) {
			return { issues: result.error.issues };
		}

		try {
			await itemColorModel.update(itemColorId, result.data);

			revalidatePath(`/${locale}/command/item-colors`);
			revalidatePath(`/${locale}/command/item-colors/${itemColorId}`);
			revalidatePath(`/${locale}/command/items`);
			revalidatePath(`/${locale}/command/item-releases`);
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

		redirect(`/${locale}/command/item-colors`);
	};

export default updateItemColorAction;
