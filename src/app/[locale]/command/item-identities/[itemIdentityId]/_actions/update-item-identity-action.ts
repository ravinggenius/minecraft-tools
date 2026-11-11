import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemIdentityModel from "@/domains/item-identity/model";
import {
	ITEM_IDENTITY_ATTRS,
	ItemIdentity
} from "@/domains/item-identity/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const updateItemIdentityAction =
	(itemIdentityId: ItemIdentity["id"]): ServerAction =>
	async (data) => {
		"use server";

		await enforceAuthorization(["update", "any", "item-identity"]);

		const locale = await extractLocaleFromRequest();

		const result = await normalizeFormData(ITEM_IDENTITY_ATTRS, data);

		if (!result.success) {
			return { issues: result.error.issues };
		}

		try {
			await itemIdentityModel.update(itemIdentityId, result.data);

			revalidatePath(`/${locale}/command/item-identities`);
			revalidatePath(
				`/${locale}/command/item-identities/${itemIdentityId}`
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

		redirect(`/${locale}/command/item-identities`);
	};

export default updateItemIdentityAction;
