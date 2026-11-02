import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemReleaseModel from "@/domains/item-release/model";
import { ITEM_RELEASE_ATTRS } from "@/domains/item-release/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const createItemReleaseAction: ServerAction = async (data) => {
	"use server";

	await enforceAuthorization(["create", "new", "item-release"]);

	const locale = await extractLocaleFromRequest();

	const result = await normalizeFormData(ITEM_RELEASE_ATTRS, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	try {
		await itemReleaseModel.create(result.data);

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

	redirect(`/${locale}/command/item-releases`);
};

export default createItemReleaseAction;
