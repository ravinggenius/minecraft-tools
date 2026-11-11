import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemIdentityModel from "@/domains/item-identity/model";
import { ITEM_IDENTITY_ATTRS } from "@/domains/item-identity/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const createItemIdentityAction: ServerAction = async (data) => {
	"use server";

	await enforceAuthorization(["create", "new", "item-identity"]);

	const locale = await extractLocaleFromRequest();

	const result = await normalizeFormData(ITEM_IDENTITY_ATTRS, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	try {
		await itemIdentityModel.create(result.data);

		revalidatePath(`/${locale}/command/item-identities`);
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

export default createItemIdentityAction;
