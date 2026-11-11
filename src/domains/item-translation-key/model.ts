import { z } from "zod/v4";

import { enforceAuthorization } from "@/library/authorization";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import {
	ITEM_TRANSLATION_KEY,
	ItemTranslationKey,
	ItemTranslationKeyAttrs
} from "./schema";
import {
	Include,
	NORMALIZED_ITEM_TRANSLATION_KEY,
	NormalizedItemTranslationKey
} from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(ITEM_TRANSLATION_KEY)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier
		FROM
			item_translation_keys
		ORDER BY
			identifier ASC
	`);

export const get = async (itemTranslationKeyId: ItemTranslationKey["id"]) => {
	await enforceAuthorization(["read", "any", "item-translation-key"]);

	return (await pool).maybeOne(sql.type(NORMALIZED_ITEM_TRANSLATION_KEY)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier,
			(
				SELECT count(*)::integer
				FROM items
				WHERE items.item_translation_key_id = item_translation_keys.id
			) AS usage_count
		FROM
			item_translation_keys
		WHERE
			id = ${itemTranslationKeyId}
	`);
};

export const create = async (attrs: ItemTranslationKeyAttrs) => {
	await enforceAuthorization(["create", "new", "item-translation-key"]);

	return (await pool).one(sql.type(ITEM_TRANSLATION_KEY)`
		INSERT INTO item_translation_keys (identifier)
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
	itemTranslationKeyId: ItemTranslationKey["id"],
	attrs: ItemTranslationKeyAttrs
) => {
	await enforceAuthorization(["update", "any", "item-translation-key"]);

	return (await pool).transaction(async (transaction) => {
		const alreadyExists = await transaction.oneFirst(sql.type(
			z.object({
				alreadyExists: z.boolean()
			})
		)`
			SELECT
				count(id) > 0 AS "already_exists"
			FROM
				item_translation_keys
			WHERE
				identifier = ${attrs.identifier}
				AND id <> ${itemTranslationKeyId}
		`);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["identifier"]
			});
		}

		return transaction.one(sql.type(ITEM_TRANSLATION_KEY)`
			UPDATE item_translation_keys
			SET
				updated_at = DEFAULT,
				identifier = ${attrs.identifier}
			WHERE id = ${itemTranslationKeyId}
			RETURNING
				id,
				created_at,
				updated_at,
				identifier
		`);
	});
};

export const destroy = async (
	itemTranslationKeyId: ItemTranslationKey["id"]
) => {
	await enforceAuthorization(["destroy", "any", "item-translation-key"]);

	return (await pool).any(sql.type(VOID)`
		DELETE FROM item_translation_keys
		WHERE id = ${itemTranslationKeyId}
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
	await enforceAuthorization(["read", "any", "item-translation-key"]);

	const whereClauses = commonSearchConditions({ include, exclude });

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			item_translation_keys
		WHERE ${sql.and(whereClauses)}
	`;

	const dataQuery = sql.type(NORMALIZED_ITEM_TRANSLATION_KEY)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier,
			(
				SELECT count(*)::integer
				FROM items
				WHERE items.item_translation_key_id = item_translation_keys.id
			) AS usage_count
		FROM
			item_translation_keys
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
			}) satisfies SearchResults<NormalizedItemTranslationKey> as SearchResults<NormalizedItemTranslationKey>
	);
};
