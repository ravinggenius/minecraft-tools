import { parseISO } from "date-fns";
import { ComponentProps } from "react";

import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { NormalizedItem } from "@/domains/item/schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResultsNormalized({
	className,
	items,
	locale,
	view
}: {
	className?: string;
	items: Readonly<Array<NormalizedItem>>;
	locale: SupportedLocale;
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
				{(item: NormalizedItem) => (
					<StatsCard
						{...{ locale }}
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
							item.names
								? {
										key: t("names.label"),
										value:
											item.names.bedrock ||
											item.names.java
												? [
														item.names.bedrock
															? t("names.value", {
																	context:
																		"editioned",
																	edition:
																		"bedrock",
																	name: item
																		.names
																		.bedrock
																})
															: null,
														item.names.java
															? t("names.value", {
																	context:
																		"editioned",
																	edition:
																		"java",
																	name: item
																		.names
																		.java
																})
															: null
													].filter(Boolean)
												: t("names.value", {
														name: item.names.both
													}),
										isLarge: true
									}
								: undefined,
							item.translationKeys
								? {
										key: t("translation-keys.label"),
										value:
											item.translationKeys.bedrock ||
											item.translationKeys.java
												? [
														item.translationKeys
															.bedrock
															? t(
																	"translation-keys.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"bedrock",
																		translationKey:
																			item
																				.translationKeys
																				.bedrock
																	}
																)
															: null,
														item.translationKeys
															.java
															? t(
																	"translation-keys.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"java",
																		translationKey:
																			item
																				.translationKeys
																				.java
																	}
																)
															: null
													].filter(Boolean)
												: t("translation-keys.value", {
														translationKey:
															item.translationKeys
																.both
													}),
										isLarge: true
									}
								: undefined,
							item.rarities
								? {
										key: t("rarities.label"),
										value:
											item.rarities.bedrock ||
											item.rarities.java
												? [
														item.rarities.bedrock
															? t(
																	"rarities.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"bedrock",
																		rarity: item
																			.rarities
																			.bedrock
																	}
																)
															: null,
														item.rarities.java
															? t(
																	"rarities.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"java",
																		rarity: item
																			.rarities
																			.java
																	}
																)
															: null
													].filter(Boolean)
												: t("rarities.value", {
														rarity: item.rarities
															.both
													})
									}
								: undefined,
							item.stackSizes
								? {
										key: t("stack-sizes.label"),
										value:
											item.stackSizes.bedrock ||
											item.stackSizes.java
												? [
														item.stackSizes.bedrock
															? t(
																	"stack-sizes.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"bedrock",
																		stackSize:
																			item
																				.stackSizes
																				.bedrock
																	}
																)
															: null,
														item.stackSizes.java
															? t(
																	"stack-sizes.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"java",
																		stackSize:
																			item
																				.stackSizes
																				.java
																	}
																)
															: null
													].filter(Boolean)
												: t("stack-sizes.value", {
														stackSize:
															item.stackSizes.both
													})
									}
								: undefined,
							{
								key: t("editions.label"),
								value: item.editions.map((edition) =>
									t("editions.value", { edition })
								)
							},
							{
								key: t("cycles-count.label"),
								value: t("cycles-count.value", {
									count: item.cyclesCount
								})
							},
							{
								key: t("releases-count.label"),
								value: t("releases-count.value", {
									count: item.releasesCount
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
							context:
								(item.names?.bedrock ??
								item.names?.java ??
								item.names?.both)
									? "has-name"
									: item.isVariant
										? "is-variant"
										: undefined,
							identifier: item.identifier,
							name:
								item.names?.bedrock ??
								item.names?.java ??
								item.names?.both,
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
					{({ identifier }: NormalizedItem) =>
						t("identifier.value", { identifier })
					}
				</Field>

				<Field fieldPath="variant" label={t("variant.label")}>
					{({ variant }: NormalizedItem) =>
						t("variant.value", { variant })
					}
				</Field>

				<Field fieldPath="names" label={t("names.label")}>
					{({ names }: NormalizedItem) =>
						names?.bedrock || names?.java ? (
							<ul>
								{names.bedrock ? (
									<li>
										{t("names.value", {
											context: "editioned",
											edition: "bedrock",
											name: names.bedrock
										})}
									</li>
								) : null}
								{names.java ? (
									<li>
										{t("names.value", {
											context: "editioned",
											edition: "java",
											name: names.java
										})}
									</li>
								) : null}
							</ul>
						) : names?.both ? (
							t("names.value", {
								name: names.both
							})
						) : null
					}
				</Field>

				<Field
					fieldPath="translationKeys"
					label={t("translation-keys.label")}
				>
					{({ translationKeys }: NormalizedItem) =>
						translationKeys?.bedrock || translationKeys?.java ? (
							<ul>
								{translationKeys.bedrock ? (
									<li>
										{t("translation-keys.value", {
											context: "editioned",
											edition: "bedrock",
											translationKey:
												translationKeys.bedrock
										})}
									</li>
								) : null}
								{translationKeys.java ? (
									<li>
										{t("translation-keys.value", {
											context: "editioned",
											edition: "java",
											translationKey: translationKeys.java
										})}
									</li>
								) : null}
							</ul>
						) : translationKeys?.both ? (
							t("translation-keys.value", {
								translationKey: translationKeys.both
							})
						) : null
					}
				</Field>

				<Field fieldPath="rarities" label={t("rarities.label")}>
					{({ rarities }: NormalizedItem) =>
						rarities?.bedrock || rarities?.java ? (
							<ul>
								{rarities.bedrock ? (
									<li>
										{t("rarities.value", {
											context: "editioned",
											edition: "bedrock",
											rarity: rarities.bedrock
										})}
									</li>
								) : null}
								{rarities.java ? (
									<li>
										{t("rarities.value", {
											context: "editioned",
											edition: "java",
											rarity: rarities.java
										})}
									</li>
								) : null}
							</ul>
						) : rarities?.both ? (
							t("rarities.value", {
								rarity: rarities.both
							})
						) : null
					}
				</Field>

				<Field fieldPath="stackSizes" label={t("stack-sizes.label")}>
					{({ stackSizes }: NormalizedItem) =>
						stackSizes?.bedrock || stackSizes?.java ? (
							<ul>
								{stackSizes.bedrock ? (
									<li>
										{t("stack-sizes.value", {
											context: "editioned",
											edition: "bedrock",
											stackSize: stackSizes.bedrock
										})}
									</li>
								) : null}
								{stackSizes.java ? (
									<li>
										{t("stack-sizes.value", {
											context: "editioned",
											edition: "java",
											stackSize: stackSizes.java
										})}
									</li>
								) : null}
							</ul>
						) : stackSizes?.both ? (
							t("stack-sizes.value", {
								stackSize: stackSizes.both
							})
						) : null
					}
				</Field>

				<Field fieldPath="editions" label={t("editions.label")}>
					{({ editions }: NormalizedItem) => (
						<ul>
							{editions.map((edition) => (
								<li key={edition}>
									{t("editions.value", {
										edition
									})}
								</li>
							))}
						</ul>
					)}
				</Field>

				<Field fieldPath="cyclesCount" label={t("cycles-count.label")}>
					{({ cyclesCount }: NormalizedItem) =>
						t("cycles-count.value", {
							count: cyclesCount
						})
					}
				</Field>

				<Field
					fieldPath="releasesCount"
					label={t("releases-count.label")}
				>
					{({ releasesCount }: NormalizedItem) =>
						t("releases-count.value", {
							count: releasesCount
						})
					}
				</Field>

				<Field
					fieldPath="releasesCount"
					label={t("first-production-released-on.label")}
				>
					{({ firstProductionReleasedOn }: NormalizedItem) =>
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
						{({ isAvailableForTools }: NormalizedItem) =>
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
