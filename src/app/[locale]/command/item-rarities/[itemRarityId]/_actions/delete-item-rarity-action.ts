import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as itemRarityModel from "@/domains/item-rarity/model";
import { ItemRarity } from "@/domains/item-rarity/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";

const deleteItemRarityAction = (itemRarityId: ItemRarity["id"]) => async () => {
	"use server";

	await enforceAuthorization(["destroy", "any", "item-rarity"]);

	const locale = await extractLocaleFromRequest();

	await itemRarityModel.destroy(itemRarityId);

	revalidatePath(`/${locale}/command/item-rarities`);
	revalidatePath(`/${locale}/command/items`);
	revalidatePath(`/${locale}/command/item-releases`);
	revalidatePath(`/${locale}/compendium/items`);

	redirect(`/${locale}/command/item-rarities`);
};

export default deleteItemRarityAction;
