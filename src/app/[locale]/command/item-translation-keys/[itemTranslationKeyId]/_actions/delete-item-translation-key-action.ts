import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as itemTranslationKeyModel from "@/domains/item-translation-key/model";
import { ItemTranslationKey } from "@/domains/item-translation-key/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";

const deleteItemTranslationKeyAction =
	(itemTranslationKeyId: ItemTranslationKey["id"]) => async () => {
		"use server";

		await enforceAuthorization(["destroy", "any", "item-translation-key"]);

		const locale = await extractLocaleFromRequest();

		await itemTranslationKeyModel.destroy(itemTranslationKeyId);

		revalidatePath(`/${locale}/command/item-translation-keys`);
		revalidatePath(`/${locale}/command/items`);
		revalidatePath(`/${locale}/command/item-releases`);
		revalidatePath(`/${locale}/compendium/items`);

		redirect(`/${locale}/command/item-translation-keys`);
	};

export default deleteItemTranslationKeyAction;
