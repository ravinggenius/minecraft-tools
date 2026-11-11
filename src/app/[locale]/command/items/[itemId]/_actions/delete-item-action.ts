import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as itemModel from "@/domains/item/model";
import { Item } from "@/domains/item/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";

const deleteItemAction = (itemId: Item["id"]) => async () => {
	"use server";

	await enforceAuthorization(["destroy", "any", "item"]);

	const locale = await extractLocaleFromRequest();

	await itemModel.destroy(itemId);

	revalidatePath(`/${locale}/command/items`);
	revalidatePath(`/${locale}/command/item-releases`);
	revalidatePath(`/${locale}/compendium/items`);

	redirect(`/${locale}/command/items`);
};

export default deleteItemAction;
