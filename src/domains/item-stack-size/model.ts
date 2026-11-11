import { z } from "zod/v4";

import { enforceAuthorization } from "@/library/authorization";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import { ITEM_STACK_SIZE, ItemStackSize, ItemStackSizeAttrs } from "./schema";
import {
	Include,
	NORMALIZED_ITEM_STACK_SIZE,
	NormalizedItemStackSize
} from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(ITEM_STACK_SIZE)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier
		FROM
			item_stack_sizes
		ORDER BY
			identifier ASC
	`);

export const get = async (itemStackSizeId: ItemStackSize["id"]) => {
	await enforceAuthorization(["read", "any", "item-stack-size"]);

	return (await pool).maybeOne(sql.type(NORMALIZED_ITEM_STACK_SIZE)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier,
			(
				SELECT count(*)::integer
				FROM items
				WHERE items.item_stack_size_id = item_stack_sizes.id
			) AS usage_count
		FROM
			item_stack_sizes
		WHERE
			id = ${itemStackSizeId}
	`);
};

export const create = async (attrs: ItemStackSizeAttrs) => {
	await enforceAuthorization(["create", "new", "item-stack-size"]);

	return (await pool).one(sql.type(ITEM_STACK_SIZE)`
		INSERT INTO item_stack_sizes (identifier)
		VALUES (${attrs.identifier})
		ON CONFLICT (identifier) DO UPDATE
		SET
			updated_at = DEFAULT
		RETURNING
			id,
			created_at,
			updated_at,
			identifier
	`);
};

export const update = async (
	itemStackSizeId: ItemStackSize["id"],
	attrs: ItemStackSizeAttrs
) => {
	await enforceAuthorization(["update", "any", "item-stack-size"]);

	return (await pool).transaction(async (transaction) => {
		const alreadyExists = await transaction.oneFirst(sql.type(
			z.object({
				alreadyExists: z.boolean()
			})
		)`
			SELECT
				count(id) > 0 AS "already_exists"
			FROM
				item_stack_sizes
			WHERE
				identifier = ${attrs.identifier}
				AND id <> ${itemStackSizeId}
		`);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["identifier"]
			});
		}

		return transaction.one(sql.type(ITEM_STACK_SIZE)`
			UPDATE item_stack_sizes
			SET
				updated_at = DEFAULT,
				identifier = ${attrs.identifier}
			WHERE id = ${itemStackSizeId}
			RETURNING
				id,
				created_at,
				updated_at,
				identifier
		`);
	});
};

export const destroy = async (itemStackSizeId: ItemStackSize["id"]) => {
	await enforceAuthorization(["destroy", "any", "item-stack-size"]);

	return (await pool).any(sql.type(VOID)`
		DELETE FROM item_stack_sizes
		WHERE id = ${itemStackSizeId}
	`);
};

const commonSearchConditions = ({
	include
}: SearchParams<Include>["conditions"]) => {
	const includeText = include.text?.map((text) => `%${text}%`);

	return [
		includeText
			? sql.fragment`identifier::text LIKE ANY(${sql.array(includeText, "text")})`
			: undefined,
		include.identifier
			? sql.fragment`identifier = ANY(${sql.array(include.identifier, "int4")})`
			: undefined
	];
};

export const search = async ({
	conditions: { include, exclude },
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	await enforceAuthorization(["read", "any", "item-stack-size"]);

	const whereClauses = commonSearchConditions({ include, exclude });

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			item_stack_sizes
		WHERE ${sql.and(whereClauses)}
	`;

	const dataQuery = sql.type(NORMALIZED_ITEM_STACK_SIZE)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier,
			(
				SELECT count(*)::integer
				FROM items
				WHERE items.item_stack_size_id = item_stack_sizes.id
			) AS usage_count
		FROM
			item_stack_sizes
		WHERE ${sql.and(whereClauses)}
		ORDER BY
			identifier ASC
		LIMIT
			${limit}
		OFFSET
			${offset}
	`;

	return (await pool).transaction(
		async (tx) =>
			({
				count: await tx.oneFirst(countQuery),
				data: await tx.any(dataQuery)
			}) satisfies SearchResults<NormalizedItemStackSize> as SearchResults<NormalizedItemStackSize>
	);
};
