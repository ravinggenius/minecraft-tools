import { confirmAuthorization } from "@/library/authorization";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import {
	FLATTENED_ITEM,
	FlattenedItem,
	ImportItem,
	NORMALIZED_ITEM,
	NormalizedItem
} from "./schema";
import { Include } from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

const commonSearchConditions = async ({
	include,
	exclude
}: SearchParams<Include>["conditions"]) => {
	const mayReadAny = await confirmAuthorization(["read", "any", "item"]);

	return [
		mayReadAny && include.isAvailableForTools !== undefined
			? sql.fragment`(is_available_for_tools = ${include.isAvailableForTools})`
			: undefined,
		mayReadAny ? undefined : sql.fragment`is_available_for_tools = ${true}`,
		include.identifier
			? sql.fragment`(identifier LIKE ANY(${sql.array(
					include.identifier.map((identifier) => `%${identifier}%`),
					"citext"
				)}))`
			: undefined,
		include.variant
			? sql.fragment`(variant LIKE ANY(${sql.array(
					include.variant.map((variant) => `%${variant}%`),
					"citext"
				)}))`
			: undefined,
		include.isVariant === undefined
			? undefined
			: sql.fragment`(is_variant IS ${include.isVariant})`
	].filter(Boolean);
};

export const searchFlattened = async ({
	conditions: { include, exclude },
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const includeText = include.text?.map((text) => `%${text}%`);

	const whereClauses = [
		...(await commonSearchConditions({ include, exclude })),
		includeText
			? sql.fragment`(
				(identifier LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(variant LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(translation_key LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(name LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(rarity::citext LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(edition::citext LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(version LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(cycle_name LIKE ANY(${sql.array(includeText, "citext")}))
			)`
			: undefined,
		include.translationKey
			? sql.fragment`(translation_key LIKE ANY(${sql.array(
					include.translationKey.map((key) => `%${key}%`),
					"citext"
				)}))`
			: undefined,
		include.name
			? sql.fragment`(name LIKE ANY(${sql.array(
					include.name.map((name) => `%${name}%`),
					"citext"
				)}))`
			: undefined,
		include.rarity
			? sql.fragment`(rarity::citext LIKE ANY(${sql.array(
					include.rarity.map((rarity) => `%${rarity}%`),
					"citext"
				)}))`
			: undefined,
		include.stackSize
			? sql.fragment`(stack_size = ANY(${sql.array(
					include.stackSize,
					"int4"
				)}))`
			: undefined,
		include.edition
			? sql.fragment`(edition::citext LIKE ANY(${sql.array(
					include.edition.map((edition) => `%${edition}%`),
					"citext"
				)}))`
			: undefined,
		include.version
			? sql.fragment`(version LIKE ANY(${sql.array(
					include.version.map((version) => `${version}%`),
					"citext"
				)}))`
			: undefined,
		include.cycleName
			? sql.fragment`(cycle_name LIKE ANY(${sql.array(
					include.cycleName.map((name) => `%${name}%`),
					"citext"
				)}))`
			: undefined
	].filter(Boolean);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			flattened_items
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
	`;

	const dataQuery = sql.type(FLATTENED_ITEM)`
		SELECT
			id,
			item_id,
			identifier,
			variant,
			is_variant,
			translation_key,
			name,
			rarity,
			stack_size,
			edition,
			cycle_name,
			version,
			first_production_released_on,
			is_available_for_tools
		FROM
			flattened_items
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
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
			}) satisfies SearchResults<FlattenedItem> as SearchResults<FlattenedItem>
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
			? sql.fragment`(
				(identifier LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(variant LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((translation_keys ->> 'bedrock') LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((translation_keys ->> 'java') LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((translation_keys ->> 'both') LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((names ->> 'bedrock') LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((names ->> 'java') LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((names ->> 'both') LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((rarities ->> 'bedrock') LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((rarities ->> 'java') LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((rarities ->> 'both') LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(editions::citext LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(
					EXISTS (
						SELECT TRUE
						FROM jsonb_array_elements_text(cycle_names) AS cycle_name
						WHERE cycle_name::citext LIKE ANY(${sql.array(includeText, "citext")})
					)
				)
			)`
			: undefined,
		include.translationKey
			? sql.fragment`(
				((translation_keys ->> 'bedrock') LIKE ANY(${sql.array(
					include.translationKey.map((key) => `%${key}%`),
					"citext"
				)}))
				OR
				((translation_keys ->> 'java') LIKE ANY(${sql.array(
					include.translationKey.map((key) => `%${key}%`),
					"citext"
				)}))
				OR
				((translation_keys ->> 'both') LIKE ANY(${sql.array(
					include.translationKey.map((key) => `%${key}%`),
					"citext"
				)}))
			)`
			: undefined,
		include.name
			? sql.fragment`(
				((names ->> 'bedrock') LIKE ANY(${sql.array(
					include.name.map((name) => `%${name}%`),
					"citext"
				)}))
				OR
				((names ->> 'java') LIKE ANY(${sql.array(
					include.name.map((name) => `%${name}%`),
					"citext"
				)}))
				OR
				((names ->> 'both') LIKE ANY(${sql.array(
					include.name.map((name) => `%${name}%`),
					"citext"
				)}))
			)`
			: undefined,
		include.rarity
			? sql.fragment`(
				((rarities ->> 'bedrock') LIKE ANY(${sql.array(
					include.rarity.map((rarity) => `%${rarity}%`),
					"citext"
				)}))
				OR
				((rarities ->> 'java') LIKE ANY(${sql.array(
					include.rarity.map((rarity) => `%${rarity}%`),
					"citext"
				)}))
				OR
				((rarities ->> 'both') LIKE ANY(${sql.array(
					include.rarity.map((rarity) => `%${rarity}%`),
					"citext"
				)}))
			)`
			: undefined,
		include.stackSize
			? sql.fragment`(
				((stack_sizes ->> 'bedrock')::integer = ANY(${sql.array(include.stackSize, "int4")}))
				OR
				((stack_sizes ->> 'java')::integer = ANY(${sql.array(include.stackSize, "int4")}))
				OR
				((stack_sizes ->> 'both')::integer = ANY(${sql.array(include.stackSize, "int4")}))
			)`
			: undefined,
		include.edition
			? sql.fragment`(
				EXISTS (
					SELECT TRUE
					FROM jsonb_array_elements_text(editions) AS edition
					WHERE edition::citext LIKE ANY(${sql.array(
						include.edition.map((edition) => `%${edition}%`),
						"citext"
					)})
				)
			)`
			: undefined,
		include.cycleName
			? sql.fragment`(
				EXISTS (
					SELECT TRUE
					FROM jsonb_array_elements_text(cycle_names) AS cycle_name
					WHERE cycle_name::citext LIKE ANY(${sql.array(
						include.cycleName.map((name) => `%${name}%`),
						"citext"
					)})
				)
			)`
			: undefined,
		include.cyclesCount
			? sql.fragment`(cycles_count >= ${include.cyclesCount.from})`
			: undefined,
		include.cyclesCount?.to === undefined
			? undefined
			: sql.fragment`(cycles_count <= ${include.cyclesCount.to})`,
		include.version
			? sql.fragment`(
				EXISTS (
					SELECT TRUE
					FROM jsonb_array_elements_text(versions) AS release_version
					WHERE release_version::citext LIKE ANY(${sql.array(
						include.version.map((version) => `${version}%`),
						"citext"
					)})
				)
			)`
			: undefined,
		include.releasesCount
			? sql.fragment`(releases_count >= ${include.releasesCount.from})`
			: undefined,
		include.releasesCount?.to === undefined
			? undefined
			: sql.fragment`(releases_count <= ${include.releasesCount.to})`
	].filter(Boolean);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			normalized_items
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
	`;

	const dataQuery = sql.type(NORMALIZED_ITEM)`
		SELECT
			id,
			identifier,
			variant,
			is_variant,
			translation_keys,
			names,
			rarities,
			stack_sizes,
			editions,
			cycles_count,
			cycle_names,
			releases_count,
			releases,
			first_production_released_on,
			is_available_for_tools
		FROM
			normalized_items
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
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
			}) satisfies SearchResults<NormalizedItem> as SearchResults<NormalizedItem>
	);
};

export const doImport = async (item: ImportItem) =>
	(await pool).any(
		sql.type(VOID)`
			WITH
			the_release AS (
				SELECT r,id
				FROM releases AS r
				INNER JOIN unnest(
				${sql.array(
					item.releases.map(({ edition }) => edition),
					"edition"
				)}::edition[],
				${sql.array(
					item.releases.map(({ version }) => version),
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
						${item.identifier},
						${item.variant ?? null}
					)
				ON CONFLICT (identifier, variant) DO UPDATE
				SET
					updated_at = DEFAULT
				RETURNING
					id
			),
			the_metadata AS (
				INSERT INTO item_metadata
					(rarity, stack_size)
				VALUES
					(
						${item.rarity},
						${item.stackSize}
					)
				ON CONFLICT (rarity, stack_size) DO UPDATE
				SET
					updated_at = DEFAULT
				RETURNING
					id
			),
			the_name AS (
				INSERT INTO item_names
					(translation_key, name)
				VALUES
					(
						${item.translationKey ?? null},
						${item.name}
					)
				ON CONFLICT (translation_key, name) DO UPDATE
				SET
					updated_at = DEFAULT
				RETURNING
					id
			)
			INSERT INTO item_releases
				(release_id, item_id, item_metadata_id, item_name_id)
			SELECT
				r.id,
				i.id,
				m.id,
				n.id
			FROM the_release AS r
			CROSS JOIN the_item AS i
			CROSS JOIN the_metadata AS m
			CROSS JOIN the_name AS n
			ON CONFLICT (release_id, item_id, item_metadata_id, item_name_id) DO UPDATE
			SET
				updated_at = DEFAULT
		`
	);
