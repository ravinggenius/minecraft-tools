import { z, ZodType } from "zod/v4";

import { EDITION, RELEASE } from "../release/schema";

export const ITEM = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	identifier: z.string(),
	variant: z.string().optional(),
	isVariant: z.boolean().readonly()
});

export type Item = z.infer<typeof ITEM>;

export const RARITY = z.enum(["common", "uncommon", "rare", "epic"]);

export type Rarity = z.infer<typeof RARITY>;

const NORMALIZED_COMPONENTS = z.record(
	z.string(),
	z.union([z.string(), z.int()])
);

const RAW_COMPONENTS_BEDROCK = z.object({
	aliasId: z.string().optional(),
	numericId: z.int().optional()
});

const RAW_COMPONENTS_JAVA = z.object({
	tags: z.array(z.string()).optional()
});

export const ITEM_METADATA = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	rarity: RARITY.optional().default("common"),
	stackSize: z.int().positive().optional().default(64),
	components: NORMALIZED_COMPONENTS.optional(),
	rawComponents: z
		.union([RAW_COMPONENTS_BEDROCK, RAW_COMPONENTS_JAVA])
		.optional()
});

export type ItemMetadata = z.infer<typeof ITEM_METADATA>;

export const ITEM_NAME = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	name: z.string(),
	translationKey: z.string().optional()
});

export type ItemName = z.infer<typeof ITEM_NAME>;

export const ITEM_RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	itemId: ITEM.shape.id,
	itemMetadataId: ITEM_METADATA.shape.id,
	releaseId: RELEASE.shape.id,
	productionReleasedOn: z.iso.date()
});

export type ItemRelease = z.infer<typeof ITEM_RELEASE>;

export const FLATTENED_ITEM = ITEM.pick({
	identifier: true,
	variant: true,
	isVariant: true
})
	.extend({
		id: ITEM_RELEASE.shape.id,
		itemId: ITEM.shape.id
	})
	.and(
		ITEM_METADATA.pick({
			rarity: true,
			stackSize: true,
			components: true,
			rawComponents: true
		})
	)
	.and(
		ITEM_NAME.pick({
			name: true,
			translationKey: true
		})
	)
	.and(
		RELEASE.pick({
			edition: true,
			version: true,
			isAvailableForTools: true
		})
	);

export type FlattenedItem = z.infer<typeof FLATTENED_ITEM>;

const EDITION_WRAPPED = <T>(schema: ZodType<T>) =>
	z
		.union([
			z.object({
				bedrock: schema,
				java: schema
			}),
			z.object({
				bedrock: schema
			}),
			z.object({
				java: schema
			}),
			z.object({
				both: schema
			})
		])
		.optional();

export const NORMALIZED_ITEM = ITEM.omit({
	createdAt: true,
	updatedAt: true
}).extend({
	names: EDITION_WRAPPED(ITEM_NAME.shape.name),
	translationKeys: EDITION_WRAPPED(
		ITEM_NAME.shape.translationKey.nonoptional()
	),
	rarities: EDITION_WRAPPED(ITEM_METADATA.shape.rarity),
	stackSizes: EDITION_WRAPPED(ITEM_METADATA.shape.stackSize),
	allComponents: EDITION_WRAPPED(
		ITEM_METADATA.shape.components.nonoptional()
	),
	allRawComponents: EDITION_WRAPPED(
		ITEM_METADATA.shape.rawComponents.nonoptional()
	),
	editions: z.array(EDITION),
	releasesCount: z.int().nonnegative(),
	releases: z.array(
		RELEASE.pick({
			edition: true,
			version: true
		})
	),
	isAvailableForTools: RELEASE.shape.isAvailableForTools
});

export type NormalizedItem = z.infer<typeof NORMALIZED_ITEM>;

export const IMPORT_ITEM = ITEM.pick({
	identifier: true,
	variant: true
})
	.and(
		ITEM_METADATA.pick({
			rarity: true,
			stackSize: true,
			components: true,
			rawComponents: true
		})
	)
	.and(
		ITEM_NAME.pick({
			name: true,
			translationKey: true
		})
	)
	.and(
		z.object({
			releases: z
				.array(
					RELEASE.pick({
						edition: true,
						version: true
					})
				)
				.min(1)
		})
	);

export type ImportItem = Prettify<z.infer<typeof IMPORT_ITEM>>;

export const IMPORT_ITEMS = z.array(IMPORT_ITEM);

export type ImportItems = z.infer<typeof IMPORT_ITEMS>;
