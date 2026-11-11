import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemRarityModel from "@/domains/item-rarity/model";
import { ITEM_RARITY_ATTRS, ItemRarity } from "@/domains/item-rarity/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const updateItemRarityAction =
	(itemRarityId: ItemRarity["id"]): ServerAction =>
	async (data) => {
		"use server";

		await enforceAuthorization(["update", "any", "item-rarity"]);

		const locale = await extractLocaleFromRequest();

		const result = await normalizeFormData(ITEM_RARITY_ATTRS, data);

		if (!result.success) {
			return { issues: result.error.issues };
		}

		try {
			await itemRarityModel.update(itemRarityId, result.data);

			revalidatePath(`/${locale}/command/item-rarities`);
			revalidatePath(`/${locale}/command/item-rarities/${itemRarityId}`);
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

		redirect(`/${locale}/command/item-rarities`);
	};

export default updateItemRarityAction;
