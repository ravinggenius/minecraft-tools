import { parseISO } from "date-fns";
import { ComponentProps } from "react";

import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { FlattenedItem } from "@/domains/item/schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResultsFlattened({
	className,
	items,
	locale,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	items: Readonly<Array<FlattenedItem>>;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-compendium-items-results"
	);

	const mayEditItems = await confirmAuthorization(["update", "any", "item"]);

	return (
		<SearchResults {...{ className, locale, view }} records={items}>
			<SearchResults.List>
				{(item: FlattenedItem) => (
					<StatsCard
						{...{ locale }}
						edition={item.edition}
						pairs={[
							{
								key: t("identifier.label"),
								value: t("identifier.value", {
									identifier: item.identifier
								}),
								isHighlighted: true,
								isLarge: true
							},
							item.isVariant
								? {
										key: t("variant.label"),
										value: t("variant.value", {
											variant: item.variant
										})
									}
								: undefined,
							item.translationKey
								? {
										key: t("translation-keys.label"),
										value: t("translation-keys.value", {
											translationKey: item.translationKey
										}),
										isLarge: true
									}
								: undefined,
							{
								key: t("names.label"),
								value: t("names.value", {
									name: item.name
								}),
								isLarge: true
							},
							{
								key: t("rarities.label"),
								value: t("rarities.value", {
									rarity: item.rarity
								})
							},
							{
								key: t("stack-sizes.label"),
								value: t("stack-sizes.value", {
									stackSize: item.stackSize
								})
							},
							{
								key: t("edition.label"),
								value: t("edition.value", {
									edition: item.edition
								})
							},
							{
								key: t("cycle-name.label"),
								value: t("cycle-name.value", {
									name: item.cycleName
								})
							},
							{
								key: t("release-version.label"),
								value: t("release-version.value", {
									version: item.version
								})
							},
							{
								key: t("first-production-released-on.label"),
								value: t("first-production-released-on.value", {
									context: item.firstProductionReleasedOn
										? undefined
										: "upcoming",
									firstProductionReleasedOn:
										item.firstProductionReleasedOn
											? parseISO(
													item.firstProductionReleasedOn
												)
											: undefined
								})
							},
							mayEditItems
								? {
										key: t("is-available-for-tools.label"),
										value: t(
											"is-available-for-tools.value",
											{
												context:
													item.isAvailableForTools
														? "yes"
														: "no"
											}
										)
									}
								: undefined
						]}
						title={t("list.card.title", {
							context: item.name
								? "has-name"
								: item.isVariant
									? "is-variant"
									: undefined,
							identifier: item.identifier,
							name: item.name,
							variant: item.variant
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: items.length })}
			>
				<Field fieldPath="identifier" label={t("identifier.label")}>
					{({ identifier }: FlattenedItem) =>
						t("identifier.value", { identifier })
					}
				</Field>

				<Field fieldPath="variant" label={t("variant.label")}>
					{({ variant }: FlattenedItem) =>
						t("variant.value", { variant })
					}
				</Field>

				<Field fieldPath="name" label={t("name.label")}>
					{({ name }: FlattenedItem) => t("name.value", { name })}
				</Field>

				<Field
					fieldPath="translationKey"
					label={t("translation-key.label")}
				>
					{({ translationKey }: FlattenedItem) =>
						t("translation-key.value", {
							translationKey
						})
					}
				</Field>

				<Field fieldPath="rarity" label={t("rarity.label")}>
					{({ rarity }: FlattenedItem) =>
						t("rarity.value", { context: rarity })
					}
				</Field>

				<Field fieldPath="stackSize" label={t("stack-size.label")}>
					{({ stackSize }: FlattenedItem) =>
						t("stack-size.value", { count: stackSize })
					}
				</Field>

				<Field fieldPath="edition" label={t("edition.label")}>
					{({ edition }: FlattenedItem) =>
						t("edition.value", { edition })
					}
				</Field>

				<Field fieldPath="version" label={t("version.label")}>
					{({ version }: FlattenedItem) =>
						t("version.value", { version })
					}
				</Field>

				<Field fieldPath="cycleName" label={t("cycle-name.label")}>
					{({ cycleName }: FlattenedItem) =>
						t("cycle-name.value", { name: cycleName })
					}
				</Field>

				<Field
					fieldPath="firstProductionReleasedOn"
					label={t("first-production-released-on.label")}
				>
					{({ firstProductionReleasedOn }: FlattenedItem) =>
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

				{mayEditItems ? (
					<Field
						fieldPath="isAvailableForTools"
						label={t("is-available-for-tools.label")}
					>
						{({ isAvailableForTools }: FlattenedItem) =>
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
