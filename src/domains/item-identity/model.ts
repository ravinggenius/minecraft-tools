import { z } from "zod/v4";

import { enforceAuthorization } from "@/library/authorization";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import { ITEM_IDENTITY, ItemIdentity, ItemIdentityAttrs } from "./schema";
import {
	Include,
	NORMALIZED_ITEM_IDENTITY,
	NormalizedItemIdentity
} from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(ITEM_IDENTITY)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier,
			variant,
			is_variant
		FROM
			item_identities
		ORDER BY
			identifier ASC,
			variant ASC
	`);

export const get = async (itemIdentityId: ItemIdentity["id"]) =>
	(await pool).maybeOne(sql.type(NORMALIZED_ITEM_IDENTITY)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier,
			variant,
			is_variant,
			(
				SELECT count(*)::integer
				FROM items
				WHERE items.item_identity_id = item_identities.id
			) AS usage_count
		FROM
			item_identities
		WHERE
			id = ${itemIdentityId}
	`);

export const create = async (attrs: ItemIdentityAttrs) => {
	await enforceAuthorization(["create", "new", "item-identity"]);

	return (await pool).one(sql.type(ITEM_IDENTITY)`
		INSERT INTO item_identities (identifier, variant)
		VALUES (${attrs.identifier}, ${attrs.variant ?? null})
		ON CONFLICT (identifier, variant) DO UPDATE
		SET
			updated_at = DEFAULT
		RETURNING
			id,
			created_at,
			updated_at,
			identifier,
			variant,
			is_variant
	`);
};

export const update = async (
	itemIdentityId: ItemIdentity["id"],
	attrs: ItemIdentityAttrs
) => {
	await enforceAuthorization(["update", "any", "item-identity"]);

	return (await pool).transaction(async (transaction) => {
		const alreadyExists = await transaction.oneFirst(sql.type(
			z.object({
				alreadyExists: z.boolean()
			})
		)`
			SELECT
				count(id) > 0 AS "already_exists"
			FROM
				item_identities
			WHERE
				identifier = ${attrs.identifier}
				AND variant IS NOT DISTINCT FROM ${attrs.variant ?? null}
				AND id <> ${itemIdentityId}
		`);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["identifier"]
			});
		}

		return transaction.one(sql.type(ITEM_IDENTITY)`
			UPDATE item_identities
			SET
				updated_at = DEFAULT,
				identifier = ${attrs.identifier},
				variant = ${attrs.variant ?? null}
			WHERE id = ${itemIdentityId}
			RETURNING
				id,
				created_at,
				updated_at,
				identifier,
				variant,
				is_variant
		`);
	});
};

export const destroy = async (itemIdentityId: ItemIdentity["id"]) => {
	await enforceAuthorization(["destroy", "any", "item-identity"]);

	return (await pool).any(sql.type(VOID)`
		DELETE FROM item_identities
		WHERE id = ${itemIdentityId}
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
					sql.fragment`variant LIKE ANY(${sql.array(includeText, "citext")})`
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
			: sql.fragment`is_variant = ${include.isVariant}`
	];
};

export const search = async ({
	conditions: { include, exclude },
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	await enforceAuthorization(["read", "any", "item-identity"]);

	const whereClauses = commonSearchConditions({ include, exclude });

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			item_identities
		WHERE ${sql.and(whereClauses)}
	`;

	const dataQuery = sql.type(NORMALIZED_ITEM_IDENTITY)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier,
			variant,
			is_variant,
			(
				SELECT count(*)::integer
				FROM items
				WHERE items.item_identity_id = item_identities.id
			) AS usage_count
		FROM
			item_identities
		WHERE ${sql.and(whereClauses)}
		ORDER BY
			identifier ASC,
			variant ASC
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
			}) satisfies SearchResults<NormalizedItemIdentity> as SearchResults<NormalizedItemIdentity>
	);
};
