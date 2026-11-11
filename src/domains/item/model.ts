import { z } from "zod/v4";

import { enforceAuthorization } from "@/library/authorization";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import {
	ITEM,
	Item,
	ITEM_ATTRS,
	ItemAttrs,
	NORMALIZED_ITEM,
	NormalizedItem
} from "./schema";
import { Include } from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(NORMALIZED_ITEM)`
		SELECT
			id,
			created_at,
			updated_at,
			item_identity_id,
			identifier,
			variant,
			is_variant,
			item_color_id,
			color,
			item_rarity_id,
			rarity,
			item_stack_size_id,
			stack_size,
			item_translation_key_id,
			translation_key,
			releases_count
		FROM
			normalized_items
		ORDER BY
			identifier ASC,
			variant ASC,
			color ASC,
			rarity ASC,
			stack_size ASC,
			translation_key ASC
	`);

export const get = async (itemId: Item["id"]) => {
	await enforceAuthorization(["read", "any", "item"]);

	return (await pool).maybeOne(sql.type(NORMALIZED_ITEM)`
		SELECT
			id,
			created_at,
			updated_at,
			item_identity_id,
			identifier,
			variant,
			is_variant,
			item_color_id,
			color,
			item_rarity_id,
			rarity,
			item_stack_size_id,
			stack_size,
			item_translation_key_id,
			translation_key,
			releases_count
		FROM
			normalized_items
		WHERE
			id = ${itemId}
	`);
};

export const create = async (attrs: ItemAttrs) => {
	await enforceAuthorization(["create", "new", "item"]);

	return (await pool).one(sql.type(ITEM)`
		INSERT INTO items
			(
				item_identity_id,
				item_color_id,
				item_rarity_id,
				item_stack_size_id,
				item_translation_key_id
			)
		VALUES
			(
				${attrs.itemIdentityId},
				${attrs.itemColorId ?? null},
				${attrs.itemRarityId},
				${attrs.itemStackSizeId},
				${attrs.itemTranslationKeyId ?? null}
			)
		ON CONFLICT (
			item_identity_id,
			item_color_id,
			item_rarity_id,
			item_stack_size_id,
			item_translation_key_id
		) DO UPDATE
		SET
			updated_at = DEFAULT
		RETURNING
			id,
			created_at,
			updated_at,
			item_identity_id,
			item_color_id,
			item_rarity_id,
			item_stack_size_id,
			item_translation_key_id
	`);
};

export const update = async (itemId: Item["id"], attrs: ItemAttrs) => {
	await enforceAuthorization(["update", "any", "item"]);

	return (await pool).transaction(async (transaction) => {
		const alreadyExists = await transaction.oneFirst(sql.type(
			z.object({
				alreadyExists: z.boolean()
			})
		)`
			SELECT
				count(id) > 0 AS "already_exists"
			FROM
				items
			WHERE
				item_identity_id = ${attrs.itemIdentityId}
				AND item_color_id IS NOT DISTINCT FROM ${attrs.itemColorId ?? null}
				AND item_rarity_id = ${attrs.itemRarityId}
				AND item_stack_size_id = ${attrs.itemStackSizeId}
				AND item_translation_key_id IS NOT DISTINCT FROM ${attrs.itemTranslationKeyId ?? null}
				AND id <> ${itemId}
		`);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["itemIdentityId"]
			});
		}

		return transaction.one(sql.type(ITEM)`
			UPDATE items
			SET
				updated_at = DEFAULT,
				item_identity_id = ${attrs.itemIdentityId},
				item_color_id = ${attrs.itemColorId ?? null},
				item_rarity_id = ${attrs.itemRarityId},
				item_stack_size_id = ${attrs.itemStackSizeId},
				item_translation_key_id = ${attrs.itemTranslationKeyId ?? null}
			WHERE id = ${itemId}
			RETURNING
				id,
				created_at,
				updated_at,
				item_identity_id,
				item_color_id,
				item_rarity_id,
				item_stack_size_id,
				item_translation_key_id
		`);
	});
};

export const destroy = async (itemId: Item["id"]) => {
	await enforceAuthorization(["destroy", "any", "item"]);

	return (await pool).any(sql.type(VOID)`
		DELETE FROM items
		WHERE id = ${itemId}
	`);
};

const commonSearchConditions = ({
	include
}: SearchParams<Include>["conditions"]) => {
	const includeText = include.text?.map((text) => `%${text}%`);

	return [
		includeText
			? sql.or([
					sql.fragment`identifier LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`variant LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`color LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`rarity LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`stack_size::text::citext LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`translation_key LIKE ANY(${sql.array(includeText, "citext")})`
				])
			: undefined,
		include.identifier
			? sql.fragment`identifier LIKE ANY(${sql.array(
					include.identifier.map((identifier) => `%${identifier}%`),
					"citext"
				)})`
			: undefined,
		include.variant
			? sql.fragment`variant LIKE ANY(${sql.array(
					include.variant.map((variant) => `%${variant}%`),
					"citext"
				)})`
			: undefined,
		include.isVariant === undefined
			? undefined
			: sql.fragment`is_variant = ${include.isVariant}`,
		include.color
			? sql.fragment`color LIKE ANY(${sql.array(
					include.color.map((color) => `%${color}%`),
					"citext"
				)})`
			: undefined,
		include.rarity
			? sql.fragment`rarity LIKE ANY(${sql.array(
					include.rarity.map((rarity) => `%${rarity}%`),
					"citext"
				)})`
			: undefined,
		include.stackSize
			? sql.fragment`stack_size = ANY(${sql.array(
					include.stackSize,
					"int4"
				)})`
			: undefined,
		include.translationKey
			? sql.fragment`translation_key LIKE ANY(${sql.array(
					include.translationKey.map((key) => `%${key}%`),
					"citext"
				)})`
			: undefined
	];
};

export const searchNormalized = async ({
	conditions: { include, exclude },
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	await enforceAuthorization(["read", "any", "item"]);

	const whereClauses = commonSearchConditions({ include, exclude });

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			normalized_items
		WHERE ${sql.and(whereClauses)}
	`;

	const dataQuery = sql.type(NORMALIZED_ITEM)`
		SELECT
			id,
			created_at,
			updated_at,
			item_identity_id,
			identifier,
			variant,
			is_variant,
			item_color_id,
			color,
			item_rarity_id,
			rarity,
			item_stack_size_id,
			stack_size,
			item_translation_key_id,
			translation_key,
			releases_count
		FROM
			normalized_items
		WHERE ${sql.and(whereClauses)}
		ORDER BY
			identifier ASC,
			variant ASC,
			color ASC,
			rarity ASC,
			stack_size ASC,
			translation_key ASC
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
			}) satisfies SearchResults<NormalizedItem> as SearchResults<NormalizedItem>
	);
};
