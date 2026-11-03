import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemTranslationKeyModel from "@/domains/item-translation-key/model";
import {
	ITEM_TRANSLATION_KEY_ATTRS,
	ItemTranslationKey
} from "@/domains/item-translation-key/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const updateItemTranslationKeyAction =
	(itemTranslationKeyId: ItemTranslationKey["id"]): ServerAction =>
	async (data) => {
		"use server";

		await enforceAuthorization(["update", "any", "item-translation-key"]);

		const locale = await extractLocaleFromRequest();

		const result = await normalizeFormData(
			ITEM_TRANSLATION_KEY_ATTRS,
			data
		);

		if (!result.success) {
			return { issues: result.error.issues };
		}

		try {
			await itemTranslationKeyModel.update(
				itemTranslationKeyId,
				result.data
			);

			revalidatePath(`/${locale}/command/item-translation-keys`);
			revalidatePath(
				`/${locale}/command/item-translation-keys/${itemTranslationKeyId}`
			);
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

		redirect(`/${locale}/command/item-translation-keys`);
	};

export default updateItemTranslationKeyAction;
