import { z, ZodType } from "zod/v4";

import { ITEM_COLOR } from "../item-color/schema";
import { ITEM_IDENTITY } from "../item-identity/schema";
import { ITEM_RARITY } from "../item-rarity/schema";
import { ITEM_STACK_SIZE } from "../item-stack-size/schema";
import { ITEM_TRANSLATION_KEY } from "../item-translation-key/schema";
import { ITEM } from "../item/schema";
import { RELEASE_CYCLE } from "../release-cycle/schema";
import { EDITION, PLATFORM_RELEASE, RELEASE } from "../release/schema";

// TODO Add aliasId (bedrock), numericId (bedrock), tags (java/both)
export const ITEM_RELEASE = z.object({
	id: z.uuid(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	releaseId: RELEASE.shape.id,
	itemId: ITEM.shape.id
});

export type ItemRelease = z.infer<typeof ITEM_RELEASE>;

export const ITEM_RELEASE_ATTRS = ITEM_RELEASE.pick({
	releaseId: true,
	itemId: true
});

export type ItemReleaseAttrs = z.infer<typeof ITEM_RELEASE_ATTRS>;

export const FLATTENED_ITEM_RELEASE = ITEM_RELEASE.pick({
	id: true,
	releaseId: true,
	itemId: true
})
	.extend({
		cycleName: RELEASE_CYCLE.shape.name,
		firstProductionReleasedOn:
			PLATFORM_RELEASE.shape.productionReleasedOn.nullish(),
		color: ITEM_COLOR.shape.identifier.nullish(),
		rarity: ITEM_RARITY.shape.identifier,
		stackSize: ITEM_STACK_SIZE.shape.identifier,
		translationKey: ITEM_TRANSLATION_KEY.shape.identifier.nullish()
	})
	.and(
		ITEM_IDENTITY.pick({
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

export const NORMALIZED_ITEM_RELEASE = ITEM_IDENTITY.pick({
	identifier: true,
	variant: true,
	isVariant: true
}).extend({
	id: ITEM.shape.id,
	itemId: ITEM.shape.id,
	colors: EDITION_WRAPPED(ITEM_COLOR.shape.identifier).nullish(),
	rarities: EDITION_WRAPPED(ITEM_RARITY.shape.identifier),
	stackSizes: EDITION_WRAPPED(ITEM_STACK_SIZE.shape.identifier),
	translationKeys: EDITION_WRAPPED(
		ITEM_TRANSLATION_KEY.shape.identifier
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

export type NormalizedItemRelease = Prettify<
	z.infer<typeof NORMALIZED_ITEM_RELEASE>
>;

export const IMPORT_ITEM_RELEASE = ITEM_IDENTITY.pick({
	identifier: true,
	variant: true
})
	.and(
		z.object({
			rarity: ITEM_RARITY.shape.identifier,
			stackSize: ITEM_STACK_SIZE.shape.identifier
		})
	)
	.and(
		z
			.object({
				color: ITEM_COLOR.shape.identifier,
				translationKey: ITEM_TRANSLATION_KEY.shape.identifier
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
