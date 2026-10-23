import { z, ZodError, ZodType } from "zod/v4";

import * as itemReleaseModel from "@/domains/item-release/model";
import {
	IMPORT_ITEM_RELEASE,
	ITEM_RELEASE
} from "@/domains/item-release/schema";
import * as releaseModel from "@/domains/release/model";
import { Edition, EDITION, IMPORT_RELEASE } from "@/domains/release/schema";
import rawImportItems from "@/services/datastore-service/fixtures/item-releases.json" with { type: "json" };

const EDITION_VALUE_OF = <TValue>(
	value: ZodType<TValue>,
	{ edition }: { edition: Edition }
) =>
	z
		.union([
			z.object({
				bedrock: value.nullable(),
				java: value.nullable()
			}),
			z.object({
				bedrock: value.nullable(),
				java: z.never().optional()
			}),
			z.object({
				bedrock: z.never().optional(),
				java: value.nullable()
			})
		])
		.transform((obj) => obj[edition] ?? undefined);

const VALUE_OF = <TValue>(
	value: ZodType<TValue>,
	context: { edition: Edition }
) => z.union([EDITION_VALUE_OF(value, context), value.nullable().optional()]);

const RAW_IMPORT_ITEM_RELEASE = (context: { edition: Edition }) =>
	z.object({
		edition: EDITION,
		identifier: z.string(),
		variant: z
			.string()
			.nullable()
			.optional()
			.transform((v) => v ?? undefined),
		color: VALUE_OF(
			ITEM_RELEASE.shape.color.unwrap().unwrap().shape.identifier,
			context
		),
		rarity: VALUE_OF(ITEM_RELEASE.shape.rarity.shape.identifier, context),
		stackSize: VALUE_OF(
			ITEM_RELEASE.shape.stackSize.shape.identifier,
			context
		),
		translationKey: VALUE_OF(
			ITEM_RELEASE.shape.translationKey.unwrap().unwrap().shape
				.identifier,
			context
		),
		firstProductionReleased: EDITION_VALUE_OF(
			IMPORT_RELEASE.shape.version,
			context
		),
		lastProductionReleasedBefore: EDITION_VALUE_OF(
			IMPORT_RELEASE.shape.version,
			context
		).optional()
	});

const RAW_IMPORT_ITEM_BY_EDITION = {
	bedrock: RAW_IMPORT_ITEM_RELEASE({
		edition: "bedrock"
	}),
	java: RAW_IMPORT_ITEM_RELEASE({ edition: "java" })
};

const RELEASES_BY_EDITION = {
	bedrock: await releaseModel.listByEdition("bedrock"),
	java: await releaseModel.listByEdition("java")
};

rawImportItems
	.flatMap((rawItemRelease) =>
		EDITION.options.map((edition) => {
			if (
				!Object.keys(rawItemRelease.firstProductionReleased).includes(
					edition
				)
			) {
				return;
			}

			try {
				return RAW_IMPORT_ITEM_BY_EDITION[edition].parse({
					...rawItemRelease,
					edition
				});
			} catch (e: unknown) {
				const error = e as ZodError;

				console.log("==========================");
				console.log("INCOMING (flatMap):", {
					...rawItemRelease,
					edition
				});
				console.log("--------------------------");

				throw error;
			}
		})
	)
	.filter(Boolean)
	.filter((itemRelease) => Boolean(itemRelease.firstProductionReleased))
	.map((itemRelease) => {
		const releaseAdded = RELEASES_BY_EDITION[itemRelease.edition].find(
			(release) => release.version === itemRelease.firstProductionReleased
		);

		const releaseRemovedBefore = RELEASES_BY_EDITION[
			itemRelease.edition
		].find(
			(release) =>
				release.version === itemRelease.lastProductionReleasedBefore
		);

		try {
			return IMPORT_ITEM_RELEASE.parse({
				...itemRelease,
				firstProductionReleased: undefined,
				lastProductionReleasedBefore: undefined,
				releases: releaseAdded
					? RELEASES_BY_EDITION[itemRelease.edition]
							.filter(
								({ position }) =>
									position >= releaseAdded.position
							)
							.filter(({ position }) =>
								releaseRemovedBefore
									? position < releaseRemovedBefore.position
									: true
							)
							.map(({ edition, version }) => ({
								edition,
								version
							}))
					: []
			});
		} catch (e: unknown) {
			const error = e as ZodError;

			console.log("==========================");
			console.log("INCOMING (map):", itemRelease);
			console.log("--------------------------");

			throw error;
		}
	})
	.reduce(
		(memo, itemRelease) =>
			memo.then(() => itemReleaseModel.doImport(itemRelease)),
		Promise.resolve([]) as ReturnType<typeof itemReleaseModel.doImport>
	);
