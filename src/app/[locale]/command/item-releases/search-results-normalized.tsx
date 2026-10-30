import { parseISO } from "date-fns";
import { ComponentProps } from "react";

import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { NormalizedItemRelease } from "@/domains/item-release/schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResultsNormalized({
	className,
	itemReleases,
	locale,
	view
}: {
	className?: string;
	itemReleases: Readonly<Array<NormalizedItemRelease>>;
	locale: SupportedLocale;
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
				{(itemRelease: NormalizedItemRelease) => (
					<StatsCard
						{...{ locale }}
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
							itemRelease.colors
								? {
										key: t("colors.label"),
										value:
											(itemRelease.colors.bedrock ??
											itemRelease.colors.java)
												? [
														itemRelease.colors
															.bedrock
															? t(
																	"colors.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"bedrock",
																		color: itemRelease
																			.colors
																			.bedrock
																	}
																)
															: null,
														itemRelease.colors.java
															? t(
																	"colors.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"java",
																		color: itemRelease
																			.colors
																			.java
																	}
																)
															: null
													].filter(Boolean)
												: t("colors.value", {
														color: itemRelease
															.colors.both
													})
									}
								: undefined,
							{
								key: t("rarities.label"),
								value:
									(itemRelease.rarities.bedrock ??
									itemRelease.rarities.java)
										? [
												itemRelease.rarities.bedrock
													? t("rarities.value", {
															context:
																"editioned",
															edition: "bedrock",
															rarity: itemRelease
																.rarities
																.bedrock
														})
													: null,
												itemRelease.rarities.java
													? t("rarities.value", {
															context:
																"editioned",
															edition: "java",
															rarity: itemRelease
																.rarities.java
														})
													: null
											].filter(Boolean)
										: t("rarities.value", {
												rarity: itemRelease.rarities
													.both
											})
							},
							{
								key: t("stack-sizes.label"),
								value:
									(itemRelease.stackSizes.bedrock ??
									itemRelease.stackSizes.java)
										? [
												itemRelease.stackSizes.bedrock
													? t("stack-sizes.value", {
															context:
																"editioned",
															edition: "bedrock",
															stackSize:
																itemRelease
																	.stackSizes
																	.bedrock
														})
													: null,
												itemRelease.stackSizes.java
													? t("stack-sizes.value", {
															context:
																"editioned",
															edition: "java",
															stackSize:
																itemRelease
																	.stackSizes
																	.java
														})
													: null
											].filter(Boolean)
										: t("stack-sizes.value", {
												stackSize:
													itemRelease.stackSizes.both
											})
							},
							itemRelease.translationKeys
								? {
										key: t("translation-keys.label"),
										value:
											(itemRelease.translationKeys
												.bedrock ??
											itemRelease.translationKeys.java)
												? [
														itemRelease
															.translationKeys
															.bedrock
															? t(
																	"translation-keys.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"bedrock",
																		translationKey:
																			itemRelease
																				.translationKeys
																				.bedrock
																	}
																)
															: null,
														itemRelease
															.translationKeys
															.java
															? t(
																	"translation-keys.value",
																	{
																		context:
																			"editioned",
																		edition:
																			"java",
																		translationKey:
																			itemRelease
																				.translationKeys
																				.java
																	}
																)
															: null
													].filter(Boolean)
												: t("translation-keys.value", {
														translationKey:
															itemRelease
																.translationKeys
																.both
													}),
										isLarge: true
									}
								: undefined,
							{
								key: t("editions.label"),
								value: itemRelease.editions.map((edition) =>
									t("editions.value", { edition })
								)
							},
							{
								key: t("cycles-count.label"),
								value: t("cycles-count.value", {
									count: itemRelease.cyclesCount
								})
							},
							{
								key: t("releases-count.label"),
								value: t("releases-count.value", {
									count: itemRelease.releasesCount
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
					{({ identifier }: NormalizedItemRelease) =>
						t("identifier.value", { identifier })
					}
				</Field>

				<Field fieldPath="variant" label={t("variant.label")}>
					{({ variant }: NormalizedItemRelease) =>
						t("variant.value", { variant })
					}
				</Field>

				<Field fieldPath="colors" label={t("colors.label")}>
					{({ colors }: NormalizedItemRelease) =>
						(colors?.bedrock ?? colors?.java) ? (
							<ul>
								{colors.bedrock ? (
									<li>
										{t("colors.value", {
											context: "editioned",
											edition: "bedrock",
											color: colors.bedrock
										})}
									</li>
								) : null}
								{colors.java ? (
									<li>
										{t("colors.value", {
											context: "editioned",
											edition: "java",
											color: colors.java
										})}
									</li>
								) : null}
							</ul>
						) : colors?.both ? (
							t("colors.value", {
								color: colors.both
							})
						) : null
					}
				</Field>

				<Field fieldPath="rarities" label={t("rarities.label")}>
					{({ rarities }: NormalizedItemRelease) =>
						(rarities.bedrock ?? rarities.java) ? (
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
						) : rarities.both ? (
							t("rarities.value", {
								rarity: rarities.both
							})
						) : null
					}
				</Field>

				<Field fieldPath="stackSizes" label={t("stack-sizes.label")}>
					{({ stackSizes }: NormalizedItemRelease) =>
						(stackSizes.bedrock ?? stackSizes.java) ? (
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
						) : stackSizes.both ? (
							t("stack-sizes.value", {
								stackSize: stackSizes.both
							})
						) : null
					}
				</Field>

				<Field
					fieldPath="translationKeys"
					label={t("translation-keys.label")}
				>
					{({ translationKeys }: NormalizedItemRelease) =>
						(translationKeys?.bedrock ?? translationKeys?.java) ? (
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

				<Field fieldPath="editions" label={t("editions.label")}>
					{({ editions }: NormalizedItemRelease) => (
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
					{({ cyclesCount }: NormalizedItemRelease) =>
						t("cycles-count.value", {
							count: cyclesCount
						})
					}
				</Field>

				<Field
					fieldPath="releasesCount"
					label={t("releases-count.label")}
				>
					{({ releasesCount }: NormalizedItemRelease) =>
						t("releases-count.value", {
							count: releasesCount
						})
					}
				</Field>

				<Field
					fieldPath="releasesCount"
					label={t("first-production-released-on.label")}
				>
					{({ firstProductionReleasedOn }: NormalizedItemRelease) =>
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
						{({ isAvailableForTools }: NormalizedItemRelease) =>
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
