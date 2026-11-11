import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as itemStackSizeModel from "@/domains/item-stack-size/model";
import { ItemStackSize } from "@/domains/item-stack-size/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";

const deleteItemStackSizeAction =
	(itemStackSizeId: ItemStackSize["id"]) => async () => {
		"use server";

		await enforceAuthorization(["destroy", "any", "item-stack-size"]);

		const locale = await extractLocaleFromRequest();

		await itemStackSizeModel.destroy(itemStackSizeId);

		revalidatePath(`/${locale}/command/item-stack-sizes`);
		revalidatePath(`/${locale}/command/items`);
		revalidatePath(`/${locale}/command/item-releases`);
		revalidatePath(`/${locale}/compendium/items`);

		redirect(`/${locale}/command/item-stack-sizes`);
	};

export default deleteItemStackSizeAction;
