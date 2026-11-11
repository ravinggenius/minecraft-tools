import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as itemIdentityModel from "@/domains/item-identity/model";
import { ItemIdentity } from "@/domains/item-identity/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";

const deleteItemIdentityAction =
	(itemIdentityId: ItemIdentity["id"]) => async () => {
		"use server";

		await enforceAuthorization(["destroy", "any", "item-identity"]);

		const locale = await extractLocaleFromRequest();

		await itemIdentityModel.destroy(itemIdentityId);

		revalidatePath(`/${locale}/command/item-identities`);
		revalidatePath(`/${locale}/command/items`);
		revalidatePath(`/${locale}/command/item-releases`);
		revalidatePath(`/${locale}/compendium/items`);

		redirect(`/${locale}/command/item-identities`);
	};

export default deleteItemIdentityAction;
