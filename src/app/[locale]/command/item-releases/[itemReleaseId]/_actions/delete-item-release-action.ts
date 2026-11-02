import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as itemReleaseModel from "@/domains/item-release/model";
import { ItemRelease } from "@/domains/item-release/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";

const deleteItemReleaseAction =
	(itemReleaseId: ItemRelease["id"]) => async () => {
		"use server";

		await enforceAuthorization(["destroy", "any", "item-release"]);

		const locale = await extractLocaleFromRequest();

		await itemReleaseModel.destroy(itemReleaseId);

		revalidatePath(`/${locale}/command/item-releases`);
		revalidatePath(`/${locale}/compendium/items`);

		redirect(`/${locale}/command/item-releases`);
	};

export default deleteItemReleaseAction;
