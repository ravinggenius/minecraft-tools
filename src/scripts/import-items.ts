import { z, ZodError, ZodType } from "zod/v4";

import * as itemModel from "@/domains/item/model";
import { IMPORT_ITEM, RARITY } from "@/domains/item/schema";
import * as releaseModel from "@/domains/release/model";
import { Edition, EDITION } from "@/domains/release/schema";
import rawImportItems from "@/services/datastore-service/fixtures/items.json" with { type: "json" };

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

const RAW_IMPORT_ITEM = (context: { edition: Edition }) =>
	z.object({
		edition: EDITION,
		identifier: z.string(),
		variant: z
			.string()
			.nullable()
			.optional()
			.transform((v) => v ?? undefined),
		translationKey: VALUE_OF(z.string(), context),
		name: VALUE_OF(z.string(), context),
		rarity: VALUE_OF(RARITY, context),
		stackSize: VALUE_OF(z.number().positive(), context),
		firstProductionReleased: EDITION_VALUE_OF(z.string(), context),
		lastProductionReleasedBefore: EDITION_VALUE_OF(
			z.string(),
			context
		).optional()
	});

const RAW_IMPORT_ITEM_BY_EDITION = {
	bedrock: RAW_IMPORT_ITEM({
		edition: "bedrock"
	}),
	java: RAW_IMPORT_ITEM({ edition: "java" })
};

const RELEASES_BY_EDITION = {
	bedrock: await releaseModel.listByEdition("bedrock"),
	java: await releaseModel.listByEdition("java")
};

rawImportItems
	.flatMap((rawItem) =>
		EDITION.options.map((edition) => {
			try {
				return RAW_IMPORT_ITEM_BY_EDITION[edition].parse({
					...rawItem,
					edition
				});
			} catch (e: unknown) {
				const error = e as ZodError;

				console.log("==========================");
				console.log("INCOMING (flatMap):", {
					...rawItem,
					edition
				});
				console.log("--------------------------");

				throw error;
			}
		})
	)
	.filter((item) => Boolean(item.firstProductionReleased))
	.map((item) => {
		const releaseAdded = RELEASES_BY_EDITION[item.edition].find(
			(release) => release.version === item.firstProductionReleased
		);

		const releaseRemovedBefore = RELEASES_BY_EDITION[item.edition].find(
			(release) => release.version === item.lastProductionReleasedBefore
		);

		try {
			return IMPORT_ITEM.parse({
				...item,
				firstProductionReleased: undefined,
				lastProductionReleasedBefore: undefined,
				releases: releaseAdded
					? RELEASES_BY_EDITION[item.edition]
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
			console.log("INCOMING (map):", item);
			console.log("--------------------------");

			throw error;
		}
	})
	.reduce(
		(memo, item) => memo.then(() => itemModel.doImport(item)),
		Promise.resolve([]) as ReturnType<typeof itemModel.doImport>
	);
