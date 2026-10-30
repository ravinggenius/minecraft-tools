import { confirmAuthorization } from "@/library/authorization";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import {
	FLATTENED_ITEM_RELEASE,
	FlattenedItemRelease,
	ImportItemRelease,
	NORMALIZED_ITEM_RELEASE,
	NormalizedItemRelease
} from "./schema";
import { Include } from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

const commonSearchConditions = async ({
	include,
	exclude
}: SearchParams<Include>["conditions"]) => {
	const mayReadAny = await confirmAuthorization([
		"read",
		"any",
		"item-release"
	]);

	return [
		mayReadAny && include.isAvailableForTools !== undefined
			? sql.fragment`is_available_for_tools = ${include.isAvailableForTools}`
			: undefined,
		mayReadAny ? undefined : sql.fragment`is_available_for_tools = ${true}`,
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
			: sql.fragment`is_variant IS ${include.isVariant}`
	];
};

export const searchFlattened = async ({
	conditions: { include, exclude },
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const includeText = include.text?.map((text) => `%${text}%`);

	const whereClauses = [
		...(await commonSearchConditions({ include, exclude })),
		includeText
			? sql.or([
					sql.fragment`identifier LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`variant LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`color::citext LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`rarity::citext LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`translation_key LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`edition::citext LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`version LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`cycle_name LIKE ANY(${sql.array(includeText, "citext")})`
				])
			: undefined,
		include.color
			? sql.fragment`color LIKE ANY(${sql.array(
					include.color.map((color) => `%${color}%`),
					"citext"
				)})`
			: undefined,
		include.rarity
			? sql.fragment`rarity::citext LIKE ANY(${sql.array(
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
			: undefined,
		include.edition
			? sql.fragment`edition::citext LIKE ANY(${sql.array(
					include.edition.map((edition) => `%${edition}%`),
					"citext"
				)})`
			: undefined,
		include.version
			? sql.fragment`version LIKE ANY(${sql.array(
					include.version.map((version) => `${version}%`),
					"citext"
				)})`
			: undefined,
		include.cycleName
			? sql.fragment`cycle_name LIKE ANY(${sql.array(
					include.cycleName.map((name) => `%${name}%`),
					"citext"
				)})`
			: undefined
	];

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			flattened_item_releases
		WHERE ${sql.and(whereClauses)}
	`;

	const dataQuery = sql.type(FLATTENED_ITEM_RELEASE)`
		SELECT
			id,
			item_id,
			identifier,
			variant,
			is_variant,
			color,
			rarity,
			stack_size,
			translation_key,
			edition,
			cycle_name,
			version,
			first_production_released_on,
			is_available_for_tools
		FROM
			flattened_item_releases
		WHERE ${sql.and(whereClauses)}
		ORDER BY
			identifier ASC,
			variant ASC,
			edition ASC,
			first_production_released_on DESC
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
			}) satisfies SearchResults<FlattenedItemRelease> as SearchResults<FlattenedItemRelease>
	);
};

export const searchNormalized = async ({
	conditions: { include, exclude },
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const includeText = include.text?.map((text) => `%${text}%`);

	const whereClauses = [
		...(await commonSearchConditions({ include, exclude })),
		includeText
			? sql.or([
					sql.fragment`identifier LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`variant LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`(colors ->> 'bedrock') LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`(colors ->> 'java') LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`(colors ->> 'both') LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`(rarities ->> 'bedrock') LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`(rarities ->> 'java') LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`(rarities ->> 'both') LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`(translation_keys ->> 'bedrock') LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`(translation_keys ->> 'java') LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`(translation_keys ->> 'both') LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`editions::citext LIKE ANY(${sql.array(includeText, "citext")})`,
					sql.fragment`
						EXISTS (
							SELECT TRUE
							FROM jsonb_array_elements_text(cycle_names) AS cycle_name
							WHERE cycle_name::citext LIKE ANY(${sql.array(includeText, "citext")})
						)
					`
				])
			: undefined,
		include.color
			? sql.or([
					sql.fragment`(colors ->> 'bedrock') LIKE ANY(${sql.array(
						include.color.map((color) => `%${color}%`),
						"citext"
					)})`,
					sql.fragment`(colors ->> 'java') LIKE ANY(${sql.array(
						include.color.map((color) => `%${color}%`),
						"citext"
					)})`,
					sql.fragment`(colors ->> 'both') LIKE ANY(${sql.array(
						include.color.map((color) => `%${color}%`),
						"citext"
					)})`
				])
			: undefined,
		include.rarity
			? sql.or([
					sql.fragment`(rarities ->> 'bedrock') LIKE ANY(${sql.array(
						include.rarity.map((rarity) => `%${rarity}%`),
						"citext"
					)})`,
					sql.fragment`(rarities ->> 'java') LIKE ANY(${sql.array(
						include.rarity.map((rarity) => `%${rarity}%`),
						"citext"
					)})`,
					sql.fragment`(rarities ->> 'both') LIKE ANY(${sql.array(
						include.rarity.map((rarity) => `%${rarity}%`),
						"citext"
					)})`
				])
			: undefined,
		include.stackSize
			? sql.or([
					sql.fragment`(stack_sizes ->> 'bedrock')::integer = ANY(${sql.array(include.stackSize, "int4")})`,
					sql.fragment`(stack_sizes ->> 'java')::integer = ANY(${sql.array(include.stackSize, "int4")})`,
					sql.fragment`(stack_sizes ->> 'both')::integer = ANY(${sql.array(include.stackSize, "int4")})`
				])
			: undefined,
		include.translationKey
			? sql.or([
					sql.fragment`(translation_keys ->> 'bedrock') LIKE ANY(${sql.array(
						include.translationKey.map((key) => `%${key}%`),
						"citext"
					)})`,
					sql.fragment`(translation_keys ->> 'java') LIKE ANY(${sql.array(
						include.translationKey.map((key) => `%${key}%`),
						"citext"
					)})`,
					sql.fragment`(translation_keys ->> 'both') LIKE ANY(${sql.array(
						include.translationKey.map((key) => `%${key}%`),
						"citext"
					)})`
				])
			: undefined,
		include.edition
			? sql.fragment`
				EXISTS (
					SELECT TRUE
					FROM jsonb_array_elements_text(editions) AS edition
					WHERE edition::citext LIKE ANY(${sql.array(
						include.edition.map((edition) => `%${edition}%`),
						"citext"
					)})
				)
			`
			: undefined,
		include.cycleName
			? sql.fragment`
				EXISTS (
					SELECT TRUE
					FROM jsonb_array_elements_text(cycle_names) AS cycle_name
					WHERE cycle_name::citext LIKE ANY(${sql.array(
						include.cycleName.map((name) => `%${name}%`),
						"citext"
					)})
				)
			`
			: undefined,
		include.cyclesCount
			? sql.fragment`cycles_count >= ${include.cyclesCount.from}`
			: undefined,
		include.cyclesCount?.to === undefined
			? undefined
			: sql.fragment`cycles_count <= ${include.cyclesCount.to}`,
		include.version
			? sql.fragment`
				EXISTS (
					SELECT TRUE
					FROM jsonb_array_elements_text(versions) AS release_version
					WHERE release_version::citext LIKE ANY(${sql.array(
						include.version.map((version) => `${version}%`),
						"citext"
					)})
				)
			`
			: undefined,
		include.releasesCount
			? sql.fragment`releases_count >= ${include.releasesCount.from}`
			: undefined,
		include.releasesCount?.to === undefined
			? undefined
			: sql.fragment`releases_count <= ${include.releasesCount.to}`
	];

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			normalized_item_releases
		WHERE ${sql.and(whereClauses)}
	`;

	const dataQuery = sql.type(NORMALIZED_ITEM_RELEASE)`
		SELECT
			id,
			item_id,
			identifier,
			variant,
			is_variant,
			colors,
			rarities,
			stack_sizes,
			translation_keys,
			editions,
			cycles_count,
			cycle_names,
			releases_count,
			releases,
			first_production_released_on,
			is_available_for_tools
		FROM
			normalized_item_releases
		WHERE ${sql.and(whereClauses)}
		ORDER BY
			first_production_released_on DESC,
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
			}) satisfies SearchResults<NormalizedItemRelease> as SearchResults<NormalizedItemRelease>
	);
};

export const doImport = async (itemRelease: ImportItemRelease) =>
	(await pool).any(
		sql.type(VOID)`
			WITH
				the_release AS (
					SELECT r,id
					FROM releases AS r
					INNER JOIN unnest(
					${sql.array(
						itemRelease.releases.map(({ edition }) => edition),
						"edition"
					)}::edition[],
					${sql.array(
						itemRelease.releases.map(({ version }) => version),
						"text"
					)}::text[]
					) AS criteria(edition, version)
					ON r.edition = criteria.edition
					AND r.version = criteria.version
				),
				the_item AS (
					INSERT INTO items
						(identifier, variant)
					VALUES
						(
							${itemRelease.identifier},
							${itemRelease.variant ?? null}
						)
					ON CONFLICT (identifier, variant) DO UPDATE
					SET
						updated_at = DEFAULT
					RETURNING
						id
				),
				the_color AS (
					INSERT INTO item_colors
						(identifier)
					SELECT source.identifier
					FROM (VALUES (${itemRelease.color ?? null}::citext)) AS source(identifier)
					WHERE source.identifier IS NOT NULL
					ON CONFLICT (identifier) DO UPDATE
					SET
						updated_at = DEFAULT
					RETURNING
						id
				),
				the_rarity AS (
					INSERT INTO item_rarities
						(identifier)
					SELECT source.identifier
					FROM (VALUES (${itemRelease.rarity}::citext)) AS source(identifier)
					WHERE source.identifier IS NOT NULL
					ON CONFLICT (identifier) DO UPDATE
					SET
						updated_at = DEFAULT
					RETURNING
						id
				),
				the_stack_size AS (
					INSERT INTO item_stack_sizes
						(identifier)
					SELECT source.identifier
					FROM (VALUES (${itemRelease.stackSize}::integer)) AS source(identifier)
					WHERE source.identifier IS NOT NULL
					ON CONFLICT (identifier) DO UPDATE
					SET
						updated_at = DEFAULT
					RETURNING
						id
				),
				the_translation_key AS (
					INSERT INTO item_translation_keys
						(identifier)
					SELECT source.identifier
					FROM (VALUES (${itemRelease.translationKey ?? null}::citext)) AS source(identifier)
					WHERE source.identifier IS NOT NULL
					ON CONFLICT (identifier) DO UPDATE
					SET
						updated_at = DEFAULT
					RETURNING
						id
				)
			INSERT INTO item_releases
				(
					release_id,
					item_id,
					item_color_id,
					item_rarity_id,
					item_stack_size_id,
					item_translation_key_id
				)
			SELECT
				r.id,
				i.id,
				(SELECT id FROM the_color),
				(SELECT id FROM the_rarity),
				(SELECT id FROM the_stack_size),
				(SELECT id FROM the_translation_key)
			FROM the_release AS r
			CROSS JOIN the_item AS i
			ON CONFLICT (
				release_id,
				item_id,
				item_color_id,
				item_rarity_id,
				item_stack_size_id,
				item_translation_key_id
			) DO UPDATE
			SET
				updated_at = DEFAULT
		`
	);
