import { parseISO } from "date-fns";
import { ComponentProps } from "react";

import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { FlattenedItemRelease } from "@/domains/item-release/schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResultsFlattened({
	className,
	itemReleases,
	locale,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	itemReleases: Readonly<Array<FlattenedItemRelease>>;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-compendium-items-results"
	);

	const mayEditItemReleases = await confirmAuthorization([
		"update",
		"any",
		"item-release"
	]);

	return (
		<SearchResults {...{ className, locale, view }} records={itemReleases}>
			<SearchResults.List>
				{(itemRelease: FlattenedItemRelease) => (
					<StatsCard
						{...{ locale }}
						edition={itemRelease.edition}
						pairs={[
							{
								key: t("identifier.label"),
								value: t("identifier.value", {
									identifier: itemRelease.identifier
								}),
								isHighlighted: true,
								isLarge: true
							},
							itemRelease.isVariant
								? {
										key: t("variant.label"),
										value: t("variant.value", {
											variant: itemRelease.variant
										})
									}
								: undefined,
							itemRelease.color
								? {
										key: t("colors.label"),
										value: t("colors.value", {
											color: itemRelease.color
										})
									}
								: null,
							{
								key: t("rarities.label"),
								value: t("rarities.value", {
									rarity: itemRelease.rarity
								})
							},
							{
								key: t("stack-sizes.label"),
								value: t("stack-sizes.value", {
									stackSize: itemRelease.stackSize
								})
							},
							itemRelease.translationKey
								? {
										key: t("translation-keys.label"),
										value: t("translation-keys.value", {
											translationKey:
												itemRelease.translationKey
										}),
										isLarge: true
									}
								: undefined,
							{
								key: t("edition.label"),
								value: t("edition.value", {
									edition: itemRelease.edition
								})
							},
							{
								key: t("cycle-name.label"),
								value: t("cycle-name.value", {
									name: itemRelease.cycleName
								})
							},
							{
								key: t("release-version.label"),
								value: t("release-version.value", {
									version: itemRelease.version
								})
							},
							{
								key: t("first-production-released-on.label"),
								value: t("first-production-released-on.value", {
									context:
										itemRelease.firstProductionReleasedOn
											? undefined
											: "upcoming",
									firstProductionReleasedOn:
										itemRelease.firstProductionReleasedOn
											? parseISO(
													itemRelease.firstProductionReleasedOn
												)
											: undefined
								})
							},
							mayEditItemReleases
								? {
										key: t("is-available-for-tools.label"),
										value: t(
											"is-available-for-tools.value",
											{
												context:
													itemRelease.isAvailableForTools
														? "yes"
														: "no"
											}
										)
									}
								: undefined
						]}
						title={t("list.card.title", {
							context: itemRelease.isVariant
								? "is-variant"
								: undefined,
							identifier: itemRelease.identifier,
							variant: itemRelease.variant
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: itemReleases.length })}
			>
				<Field fieldPath="identifier" label={t("identifier.label")}>
					{({ identifier }: FlattenedItemRelease) =>
						t("identifier.value", { identifier })
					}
				</Field>

				<Field fieldPath="variant" label={t("variant.label")}>
					{({ variant }: FlattenedItemRelease) =>
						t("variant.value", { variant })
					}
				</Field>

				<Field fieldPath="color" label={t("color.label")}>
					{({ color }: FlattenedItemRelease) =>
						t("color.value", { color })
					}
				</Field>

				<Field fieldPath="rarity" label={t("rarity.label")}>
					{({ rarity }: FlattenedItemRelease) =>
						t("rarity.value", { rarity })
					}
				</Field>

				<Field fieldPath="stackSize" label={t("stack-size.label")}>
					{({ stackSize }: FlattenedItemRelease) =>
						t("stack-size.value", { count: stackSize })
					}
				</Field>

				<Field
					fieldPath="translationKey"
					label={t("translation-key.label")}
				>
					{({ translationKey }: FlattenedItemRelease) =>
						t("translation-key.value", {
							translationKey
						})
					}
				</Field>

				<Field fieldPath="edition" label={t("edition.label")}>
					{({ edition }: FlattenedItemRelease) =>
						t("edition.value", { edition })
					}
				</Field>

				<Field fieldPath="version" label={t("version.label")}>
					{({ version }: FlattenedItemRelease) =>
						t("version.value", { version })
					}
				</Field>

				<Field fieldPath="cycleName" label={t("cycle-name.label")}>
					{({ cycleName }: FlattenedItemRelease) =>
						t("cycle-name.value", { name: cycleName })
					}
				</Field>

				<Field
					fieldPath="firstProductionReleasedOn"
					label={t("first-production-released-on.label")}
				>
					{({ firstProductionReleasedOn }: FlattenedItemRelease) =>
						t("first-production-released-on.value", {
							context: firstProductionReleasedOn
								? undefined
								: "upcoming",
							firstProductionReleasedOn: firstProductionReleasedOn
								? parseISO(firstProductionReleasedOn)
								: undefined
						})
					}
				</Field>

				{mayEditItemReleases ? (
					<Field
						fieldPath="isAvailableForTools"
						label={t("is-available-for-tools.label")}
					>
						{({ isAvailableForTools }: FlattenedItemRelease) =>
							t("is-available-for-tools.value", {
								context: isAvailableForTools ? "yes" : "no"
							})
						}
					</Field>
				) : null}
			</SearchResults.Table>
		</SearchResults>
	);
}
