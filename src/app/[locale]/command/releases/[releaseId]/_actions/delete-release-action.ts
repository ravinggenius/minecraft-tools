import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as releaseModel from "@/domains/release/model";
import { Release } from "@/domains/release/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";

const deleteRelease = (releaseId: Release["id"]) => async () => {
	"use server";

	await enforceAuthorization(["destroy", "any", "release"]);

	const locale = await extractLocaleFromRequest();

	await releaseModel.destroy(releaseId);

	revalidatePath(`/${locale}/compendium/releases`);
	revalidatePath(`/${locale}/command/releases`);

	redirect(`/${locale}/command/releases`);
};

export default deleteRelease;
