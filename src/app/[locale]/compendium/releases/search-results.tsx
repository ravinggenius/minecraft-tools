import { ComponentProps } from "react";

import { Field } from "@/components/DataTable/DataTable";
import KeyValueCard from "@/components/Pagination/KeyValueCard/KeyValueCard";
import SearchResults from "@/components/SearchResults/SearchResults";
import { ExtendedRelease } from "@/domains/release/model";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

export default async function PageSearchResults({
	className,
	locale,
	releases,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	releases: Readonly<Array<ExtendedRelease>>;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-compendium-releases-results"
	);

	return (
		<SearchResults {...{ className, locale, view }} records={releases}>
			<SearchResults.List>
				{(release: ExtendedRelease) => (
					<KeyValueCard
						{...{ locale, release }}
						edition={release.edition}
						pairs={[
							{
								key: t("cycle.label"),
								value: t("cycle.value", {
									major: release.cycle[0],
									minor: release.cycle[1]
								})
							},
							...(release.developmentReleasedOn
								? [
										{
											key: t(
												"development-released-on.label"
											),
											value: t(
												"development-released-on.value",
												{
													developmentReleasedOn:
														new Date(
															release.developmentReleasedOn
														)
												}
											)
										}
									]
								: []),
							{
								key: t("production-released-on.label"),
								value: release.notesUrl
									? {
											href: release.notesUrl,
											text: t(
												"production-released-on.value",
												{
													productionReleasedOn:
														new Date(
															release.productionReleasedOn
														)
												}
											),
											isExternal: true
										}
									: t("production-released-on.value", {
											productionReleasedOn: new Date(
												release.productionReleasedOn
											)
										})
							},
							{
								key: t("is-earliest-in-cycle.label"),
								value: t("is-earliest-in-cycle.value", {
									context: release.isEarliestInCycle
										? "yes"
										: "no"
								})
							},
							{
								key: t("is-latest-in-cycle.label"),
								value: t("is-latest-in-cycle.value", {
									context: release.isLatestInCycle
										? "yes"
										: "no"
								})
							},
							{
								key: t("is-latest.label"),
								value: t("is-latest.value", {
									context: release.isLatest ? "yes" : "no"
								}),
								isHighlighted: release.isLatest || undefined
							},
							{
								key: t("platform-releases.label"),
								value: release.platformReleases.map(
									({ name }) => name
								),
								isLarge: true
							}
						]}
						title={t("version.value", { version: release.version })}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: releases.length })}
			>
				<Field fieldPath="edition" label={t("edition.label")}>
					{({ edition }: ExtendedRelease) =>
						t("edition.value", { context: edition })
					}
				</Field>

				<Field fieldPath="cycle" label={t("cycle.label")}>
					{({ cycle: [major, minor] }: ExtendedRelease) =>
						t("cycle.value", { major, minor })
					}
				</Field>

				<Field fieldPath="version" label={t("version.label")}>
					{({ notesUrl, version }: ExtendedRelease) =>
						notesUrl ? (
							<a href={notesUrl} rel="noreferrer">
								{t("version.value", { version })}
							</a>
						) : (
							t("version.value", { version })
						)
					}
				</Field>

				<Field
					fieldPath="developmentReleasedOn"
					label={t("development-released-on.label")}
				>
					{({ developmentReleasedOn }: ExtendedRelease) =>
						developmentReleasedOn
							? t("development-released-on.value", {
									developmentReleasedOn: new Date(
										developmentReleasedOn
									)
								})
							: t("development-released-on.value", {
									context: "unknown"
								})
					}
				</Field>

				<Field
					fieldPath="productionReleasedOn"
					label={t("production-released-on.label")}
				>
					{({ productionReleasedOn }: ExtendedRelease) =>
						t("production-released-on.value", {
							productionReleasedOn: new Date(productionReleasedOn)
						})
					}
				</Field>

				<Field
					fieldPath="isEarliestInCycle"
					label={t("is-earliest-in-cycle.label")}
				>
					{({ isEarliestInCycle }: ExtendedRelease) =>
						t("is-earliest-in-cycle.value", {
							context: isEarliestInCycle ? "yes" : "no"
						})
					}
				</Field>

				<Field
					fieldPath="isLatestInCycle"
					label={t("is-latest-in-cycle.label")}
				>
					{({ isLatestInCycle }: ExtendedRelease) =>
						t("is-latest-in-cycle.value", {
							context: isLatestInCycle ? "yes" : "no"
						})
					}
				</Field>

				<Field fieldPath="isLatest" label={t("is-latest.label")}>
					{({ isLatest }: ExtendedRelease) =>
						t("is-latest.value", {
							context: isLatest ? "yes" : "no"
						})
					}
				</Field>

				<Field
					fieldPath="platformReleases"
					label={t("platform-releases.label")}
				>
					{({ platformReleases }: ExtendedRelease) => (
						<ol>
							{platformReleases.map((pr) => (
								<li key={pr.id}>
									<span>{pr.name}</span>
									<span>
										{new Date(
											pr.releasedOn
										).toLocaleDateString()}
									</span>
								</li>
							))}
						</ol>
					)}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
