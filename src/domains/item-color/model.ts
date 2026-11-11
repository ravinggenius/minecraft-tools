import { z } from "zod/v4";

import { enforceAuthorization } from "@/library/authorization";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import { ITEM_COLOR, ItemColor, ItemColorAttrs } from "./schema";
import {
	Include,
	NORMALIZED_ITEM_COLOR,
	NormalizedItemColor
} from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(ITEM_COLOR)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier
		FROM
			item_colors
		ORDER BY
			identifier ASC
	`);

export const get = async (itemColorId: ItemColor["id"]) => {
	await enforceAuthorization(["read", "any", "item-color"]);

	return (await pool).maybeOne(sql.type(NORMALIZED_ITEM_COLOR)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier,
			(
				SELECT count(*)::integer
				FROM items
				WHERE items.item_color_id = item_colors.id
			) AS usage_count
		FROM
			item_colors
		WHERE
			id = ${itemColorId}
	`);
};

export const create = async (attrs: ItemColorAttrs) => {
	await enforceAuthorization(["create", "new", "item-color"]);

	return (await pool).one(sql.type(ITEM_COLOR)`
		INSERT INTO item_colors (identifier)
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
	itemColorId: ItemColor["id"],
	attrs: ItemColorAttrs
) => {
	await enforceAuthorization(["update", "any", "item-color"]);

	return (await pool).transaction(async (transaction) => {
		const alreadyExists = await transaction.oneFirst(sql.type(
			z.object({
				alreadyExists: z.boolean()
			})
		)`
			SELECT
				count(id) > 0 AS "already_exists"
			FROM
				item_colors
			WHERE
				identifier = ${attrs.identifier}
				AND id <> ${itemColorId}
		`);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["identifier"]
			});
		}

		return transaction.one(sql.type(ITEM_COLOR)`
			UPDATE item_colors
			SET
				updated_at = DEFAULT,
				identifier = ${attrs.identifier}
			WHERE id = ${itemColorId}
			RETURNING
				id,
				created_at,
				updated_at,
				identifier
		`);
	});
};

export const destroy = async (itemColorId: ItemColor["id"]) => {
	await enforceAuthorization(["destroy", "any", "item-color"]);

	return (await pool).any(sql.type(VOID)`
		DELETE FROM item_colors
		WHERE id = ${itemColorId}
	`);
};

const commonSearchConditions = ({
	include
}: SearchParams<Include>["conditions"]) => {
	const includeText = include.text?.map((text) => `%${text}%`);

	return [
		includeText
			? sql.fragment`identifier LIKE ANY(${sql.array(includeText, "citext")})`
			: undefined,
		include.identifier
			? sql.fragment`identifier LIKE ANY(${sql.array(
					include.identifier.map((identifier) => `%${identifier}%`),
					"citext"
				)})`
			: undefined
	];
};

export const search = async ({
	conditions: { include, exclude },
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	await enforceAuthorization(["read", "any", "item-color"]);

	const whereClauses = commonSearchConditions({ include, exclude });

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			item_colors
		WHERE ${sql.and(whereClauses)}
	`;

	const dataQuery = sql.type(NORMALIZED_ITEM_COLOR)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier,
			(
				SELECT count(*)::integer
				FROM items
				WHERE items.item_color_id = item_colors.id
			) AS usage_count
		FROM
			item_colors
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
			}) satisfies SearchResults<NormalizedItemColor> as SearchResults<NormalizedItemColor>
	);
};
