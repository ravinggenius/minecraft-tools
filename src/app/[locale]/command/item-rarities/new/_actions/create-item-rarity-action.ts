import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemRarityModel from "@/domains/item-rarity/model";
import { ITEM_RARITY_ATTRS } from "@/domains/item-rarity/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const createItemRarityAction: ServerAction = async (data) => {
	"use server";

	await enforceAuthorization(["create", "new", "item-rarity"]);

	const locale = await extractLocaleFromRequest();

	const result = await normalizeFormData(ITEM_RARITY_ATTRS, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	try {
		await itemRarityModel.create(result.data);

		revalidatePath(`/${locale}/command/item-rarities`);
	} catch (error: unknown) {
		if (error instanceof CodedError) {
			return error.toJson();
		} else if (error instanceof ZodError) {
			return { issues: error.issues };
		} else {
			throw error;
		}
	}

	redirect(`/${locale}/command/item-rarities`);
};

export default createItemRarityAction;
