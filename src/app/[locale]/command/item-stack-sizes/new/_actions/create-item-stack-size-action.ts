import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as itemStackSizeModel from "@/domains/item-stack-size/model";
import { ITEM_STACK_SIZE_ATTRS } from "@/domains/item-stack-size/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

const createItemStackSizeAction: ServerAction = async (data) => {
	"use server";

	await enforceAuthorization(["create", "new", "item-stack-size"]);

	const locale = await extractLocaleFromRequest();

	const result = await normalizeFormData(ITEM_STACK_SIZE_ATTRS, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	try {
		await itemStackSizeModel.create(result.data);

		revalidatePath(`/${locale}/command/item-stack-sizes`);
	} catch (error: unknown) {
		if (error instanceof CodedError) {
			return error.toJson();
		} else if (error instanceof ZodError) {
			return { issues: error.issues };
		} else {
			throw error;
		}
	}

	redirect(`/${locale}/command/item-stack-sizes`);
};

export default createItemStackSizeAction;
