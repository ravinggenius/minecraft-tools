import { z, ZodType } from "zod/v4";

import { ITEM } from "../item/schema";
import { RELEASE_CYCLE } from "../release-cycle/schema";
import { EDITION, PLATFORM_RELEASE, RELEASE } from "../release/schema";

const ITEM_COMPONENT = <T>(identifier: ZodType<T>) =>
	z.object({
		id: z.uuid(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
		identifier
	});

const ITEM_COLOR = ITEM_COMPONENT(z.string());

const ITEM_RARITY = ITEM_COMPONENT(z.string());

const ITEM_STACK_SIZE = ITEM_COMPONENT(z.int().positive());

const ITEM_TRANSLATION_KEY = ITEM_COMPONENT(z.string());

// TODO Add aliasId (bedrock), numericId (bedrock), tags (java/both)
export const ITEM_RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	releaseId: RELEASE.shape.id,
	itemId: ITEM.shape.id,
	color: ITEM_COLOR.pick({ id: true, identifier: true }).nullish(),
	rarity: ITEM_RARITY.pick({ id: true, identifier: true }),
	stackSize: ITEM_STACK_SIZE.pick({ id: true, identifier: true }),
	translationKey: ITEM_TRANSLATION_KEY.pick({
		id: true,
		identifier: true
	}).nullish(),
	firstProductionReleasedOn:
		PLATFORM_RELEASE.shape.productionReleasedOn.nullish()
});

export type ItemRelease = z.infer<typeof ITEM_RELEASE>;

export const FLATTENED_ITEM_RELEASE = ITEM_RELEASE.pick({
	id: true,
	itemId: true
})
	.extend({
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
		ITEM.pick({
			identifier: true,
			variant: true,
			isVariant: true
		})
	)
	.and(
		RELEASE.pick({
			edition: true,
			version: true,
			isAvailableForTools: true
		})
	);

export type FlattenedItemRelease = Prettify<
	z.infer<typeof FLATTENED_ITEM_RELEASE>
>;

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

export const NORMALIZED_ITEM_RELEASE = ITEM_RELEASE.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	color: true,
	rarity: true,
	stackSize: true,
	translationKey: true,
	releaseId: true
})
	.extend({
		id: ITEM.shape.id,
		itemId: ITEM.shape.id,
		colors: EDITION_WRAPPED(
			ITEM_RELEASE.shape.color.unwrap().unwrap().shape.identifier
		).nullish(),
		rarities: EDITION_WRAPPED(ITEM_RELEASE.shape.rarity.shape.identifier),
		stackSizes: EDITION_WRAPPED(
			ITEM_RELEASE.shape.stackSize.shape.identifier
		),
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
	})
	.and(
		ITEM.pick({
			identifier: true,
			variant: true,
			isVariant: true
		})
	);

export type NormalizedItemRelease = Prettify<
	z.infer<typeof NORMALIZED_ITEM_RELEASE>
>;

export const IMPORT_ITEM_RELEASE = ITEM.pick({
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

export type ImportItemRelease = Prettify<z.infer<typeof IMPORT_ITEM_RELEASE>>;
