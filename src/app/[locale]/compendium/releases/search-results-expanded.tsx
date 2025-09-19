import { parseISO } from "date-fns";
import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import KeyValueCard from "@/components/Pagination/KeyValueCard/KeyValueCard";
import SearchResults from "@/components/SearchResults/SearchResults";
import { SpecificRelease } from "@/domains/release/schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResultsExpanded({
	className,
	locale,
	releases,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	releases: Readonly<Array<SpecificRelease>>;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-compendium-releases-results"
	);

	const mayEditReleases = await confirmAuthorization([
		"update",
		"any",
		"release"
	]);

	return (
		<SearchResults {...{ className, locale, view }} records={releases}>
			<SearchResults.List>
				{(release: SpecificRelease) => (
					<KeyValueCard
						{...{ locale }}
						edition={release.edition}
						href={
							mayEditReleases
								? `/${locale}/command/releases/${release.releaseId}`
								: undefined
						}
						pairs={[
							release.developmentReleasedOn
								? {
										key: t("development-released-on.label"),
										value: t(
											"development-released-on.value",
											{
												developmentReleasedOn: parseISO(
													release.developmentReleasedOn
												)
											}
										)
									}
								: undefined,
							{
								key: t("production-released-on.label"),
								value: release.changelog
									? {
											href: release.changelog,
											text: t(
												"production-released-on.value",
												{
													context:
														release.productionReleasedOn
															? undefined
															: "upcoming",
													productionReleasedOn:
														release.productionReleasedOn
															? parseISO(
																	release.productionReleasedOn
																)
															: undefined
												}
											),
											isExternal: true
										}
									: t("production-released-on.value", {
											context:
												release.productionReleasedOn
													? undefined
													: "upcoming",
											productionReleasedOn:
												release.productionReleasedOn
													? parseISO(
															release.productionReleasedOn
														)
													: undefined
										})
							},
							mayEditReleases
								? {
										key: t("is-available-for-tools.label"),
										value: t(
											"is-available-for-tools.value",
											{
												context:
													release.isAvailableForTools
														? "yes"
														: "no"
											}
										)
									}
								: undefined,
							{
								key: t("is-latest.label"),
								value: t("is-latest.value", {
									context: release.isLatest ? "yes" : "no"
								}),
								isHighlighted: release.isLatest || undefined
							},
							{
								key: t("platform-name.label"),
								value: t("platform-name.value", {
									context: release.platformName
										? undefined
										: "upcoming",
									platformName: release.platformName
								})
							}
						]}
						title={t("list.card.title", {
							context:
								release.cycleName &&
								!release.version.startsWith(release.cycleName)
									? "named"
									: undefined,
							version: release.version,
							name: release.cycleName
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: releases.length })}
			>
				<Field fieldPath="edition" label={t("edition.label")}>
					{({ edition }: SpecificRelease) =>
						t("edition.value", { context: edition })
					}
				</Field>

				<Field fieldPath="version" label={t("version.label")}>
					{({ releaseId, version }: SpecificRelease) =>
						mayEditReleases ? (
							<Anchor
								href={`/${locale}/command/releases/${releaseId}`}
								variant="inline"
							>
								{t("version.value", { version })}
							</Anchor>
						) : (
							t("version.value", { version })
						)
					}
				</Field>

				<Field fieldPath="cycleName" label={t("cycle-name.label")}>
					{({ cycleName: name }: SpecificRelease) =>
						t("cycle-name.value", { name })
					}
				</Field>

				<Field fieldPath="changelog" label={t("changelog.label")}>
					{({ changelog }: SpecificRelease) =>
						changelog ? (
							<a href={changelog} rel="noreferrer">
								{changelog}
							</a>
						) : null
					}
				</Field>

				<Field
					fieldPath="developmentReleasedOn"
					label={t("development-released-on.label")}
				>
					{({ developmentReleasedOn }: SpecificRelease) =>
						developmentReleasedOn
							? t("development-released-on.value", {
									developmentReleasedOn: parseISO(
										developmentReleasedOn
									)
								})
							: null
					}
				</Field>

				<Field
					fieldPath="productionReleasedOn"
					label={t("production-released-on.label")}
				>
					{({ productionReleasedOn }: SpecificRelease) =>
						productionReleasedOn
							? t("production-released-on.value", {
									productionReleasedOn: productionReleasedOn
										? parseISO(productionReleasedOn)
										: undefined
								})
							: null
					}
				</Field>

				{mayEditReleases ? (
					<Field
						fieldPath="isAvailableForTools"
						label={t("is-available-for-tools.label")}
					>
						{({ isAvailableForTools }: SpecificRelease) =>
							t("is-available-for-tools.value", {
								context: isAvailableForTools ? "yes" : "no"
							})
						}
					</Field>
				) : null}

				<Field fieldPath="isLatest" label={t("is-latest.label")}>
					{({ isLatest }: SpecificRelease) =>
						t("is-latest.value", {
							context: isLatest ? "yes" : "no"
						})
					}
				</Field>

				<Field
					fieldPath="platformName"
					label={t("platform-name.label")}
				>
					{({ platformName }: SpecificRelease) =>
						platformName
							? t("platform-name.value", {
									platformName
								})
							: null
					}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
