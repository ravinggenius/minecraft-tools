import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as itemColorModel from "@/domains/item-color/model";
import { ItemColor } from "@/domains/item-color/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";

const deleteItemColorAction = (itemColorId: ItemColor["id"]) => async () => {
	"use server";

	await enforceAuthorization(["destroy", "any", "item-color"]);

	const locale = await extractLocaleFromRequest();

	await itemColorModel.destroy(itemColorId);

	revalidatePath(`/${locale}/command/item-colors`);
	revalidatePath(`/${locale}/command/items`);
	revalidatePath(`/${locale}/command/item-releases`);
	revalidatePath(`/${locale}/compendium/items`);

	redirect(`/${locale}/command/item-colors`);
};

export default deleteItemColorAction;
