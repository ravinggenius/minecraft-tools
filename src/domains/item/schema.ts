import { z, ZodType } from "zod/v4";

import { RELEASE_CYCLE } from "../release-cycle/schema";
import { EDITION, PLATFORM_RELEASE, RELEASE } from "../release/schema";

export const ITEM = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	identifier: z.string(),
	variant: z.string().nullish(),
	isVariant: z.boolean().readonly()
});

export type Item = z.infer<typeof ITEM>;

const ITEM_COMPONENT = <T>(identifier: ZodType<T>) =>
	z.object({
		id: z.uuid(),
		createdAt: z.iso.date(),
		updatedAt: z.iso.date(),
		identifier
	});

const ITEM_COLOR = ITEM_COMPONENT(z.string());

const ITEM_RARITY = ITEM_COMPONENT(z.string());

const ITEM_STACK_SIZE = ITEM_COMPONENT(z.int().positive());

const ITEM_TRANSLATION_KEY = ITEM_COMPONENT(z.string());

// TODO Add aliasId (bedrock), numericId (bedrock), tags (java/both)
export const ITEM_RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	releaseId: RELEASE.shape.id,
	itemId: ITEM.shape.id,
	color: ITEM_COLOR.pick({ id: true, identifier: true }).nullish(),
	rarity: ITEM_RARITY.pick({ id: true, identifier: true }),
	stackSize: ITEM_STACK_SIZE.pick({ id: true, identifier: true }),
	translationKey: ITEM_TRANSLATION_KEY.pick({
		id: true,
		identifier: true
	}).nullish(),
	productionReleasedOn: PLATFORM_RELEASE.shape.productionReleasedOn
});

export type ItemRelease = z.infer<typeof ITEM_RELEASE>;

export const ITEM_ATTRS = ITEM.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isVariant: true
});

export type ItemAttrs = z.infer<typeof ITEM_ATTRS>;

export const FLATTENED_ITEM = ITEM.pick({
	identifier: true,
	variant: true,
	isVariant: true
})
	.extend({
		id: ITEM_RELEASE.shape.id,
		itemId: ITEM.shape.id,
		cycleName: RELEASE_CYCLE.shape.name,
		firstProductionReleasedOn:
			PLATFORM_RELEASE.shape.productionReleasedOn.nullish(),
		color: ITEM_RELEASE.shape.color
			.unwrap()
			.unwrap()
			.shape.identifier.nullish(),
		rarity: ITEM_RELEASE.shape.rarity.shape.identifier,
		stackSize: ITEM_RELEASE.shape.stackSize.shape.identifier,
		translationKey: ITEM_RELEASE.shape.translationKey
			.unwrap()
			.unwrap()
			.shape.identifier.nullish()
	})
	.and(
		RELEASE.pick({
			edition: true,
			version: true,
			isAvailableForTools: true
		})
	);

export type FlattenedItem = Prettify<z.infer<typeof FLATTENED_ITEM>>;

interface EditionWrappedBedrockJava<T> {
	bedrock: T;
	java: T;
	both?: never;
}

interface EditionWrappedBedrock<T> {
	bedrock: T;
	java?: never;
	both?: never;
}

interface EditionWrappedJava<T> {
	bedrock?: never;
	java: T;
	both?: never;
}

interface EditionWrappedBoth<T> {
	bedrock?: never;
	java?: never;
	both: T;
}

export type EditionWrapped<T> =
	| EditionWrappedBedrockJava<T>
	| EditionWrappedBedrock<T>
	| EditionWrappedJava<T>
	| EditionWrappedBoth<T>;

const EDITION_WRAPPED = <T>(schema: ZodType<T>): ZodType<EditionWrapped<T>> =>
	z.union([
		z.object({
			bedrock: schema,
			java: schema,
			both: z.never().optional()
		}),
		z.object({
			bedrock: schema,
			java: z.never().optional(),
			both: z.never().optional()
		}),
		z.object({
			bedrock: z.never().optional(),
			java: schema,
			both: z.never().optional()
		}),
		z.object({
			bedrock: z.never().optional(),
			java: z.never().optional(),
			both: schema
		})
	]);

export const NORMALIZED_ITEM = ITEM.omit({
	createdAt: true,
	updatedAt: true
}).extend({
	colors: EDITION_WRAPPED(
		ITEM_RELEASE.shape.color.unwrap().unwrap().shape.identifier
	).nullish(),
	rarities: EDITION_WRAPPED(ITEM_RELEASE.shape.rarity.shape.identifier),
	stackSizes: EDITION_WRAPPED(ITEM_RELEASE.shape.stackSize.shape.identifier),
	translationKeys: EDITION_WRAPPED(
		ITEM_RELEASE.shape.translationKey.unwrap().unwrap().shape.identifier
	).nullish(),
	editions: z.array(EDITION),
	cyclesCount: z.int().nonnegative(),
	cycleNames: z.array(RELEASE_CYCLE.shape.name),
	releasesCount: z.int().nonnegative(),
	releases: z.array(
		RELEASE.pick({
			edition: true,
			version: true
		})
	),
	firstProductionReleasedOn:
		PLATFORM_RELEASE.shape.productionReleasedOn.nullish(),
	isAvailableForTools: RELEASE.shape.isAvailableForTools
});

export type NormalizedItem = z.infer<typeof NORMALIZED_ITEM>;

export const IMPORT_ITEM = ITEM.pick({
	identifier: true,
	variant: true
})
	.and(
		z.object({
			rarity: ITEM_RELEASE.shape.rarity.shape.identifier,
			stackSize: ITEM_RELEASE.shape.stackSize.shape.identifier
		})
	)
	.and(
		z
			.object({
				color: ITEM_RELEASE.shape.color.unwrap().unwrap().shape
					.identifier,
				translationKey: ITEM_RELEASE.shape.translationKey
					.unwrap()
					.unwrap().shape.identifier
			})
			.partial()
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
