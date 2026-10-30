import { enforceAuthorization } from "@/library/authorization";

import { Item, ItemAttrs } from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const get = async (itemId: Item["id"]) => {
	//
	return undefined as Item | undefined;
};

export const create = async (attrs: ItemAttrs) => {
	await enforceAuthorization(["create", "new", "item"]);
};

export const update = async (itemId: Item["id"], attrs: ItemAttrs) => {
	await enforceAuthorization(["update", "any", "item"]);
};
