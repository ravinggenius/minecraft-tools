import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemModel from "@/domains/item/model";
import { ITEM_ATTRS } from "@/domains/item/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const createItemAction: ServerAction = async (data) => {
	"use server";

	await enforceAuthorization(["create", "new", "item"]);

	const locale = await extractLocaleFromRequest();

	const result = await normalizeFormData(ITEM_ATTRS, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	try {
		await itemModel.create(result.data);

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

	redirect(`/${locale}/command/items`);
};

export default createItemAction;
