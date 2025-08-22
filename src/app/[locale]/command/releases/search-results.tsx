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
						{...{ locale }}
						edition={release.edition}
						pairs={[
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
								value: release.changelog
									? {
											href: release.changelog,
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
								key: t("is-available-for-tools.label"),
								value: t("is-available-for-tools.value", {
									context: release.isAvailableForTools
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
						title={t("list.card.title", {
							context: release.name ? "named" : undefined,
							version: release.version,
							name: release.name
						})}
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

				<Field fieldPath="version" label={t("version.label")}>
					{({ version }: ExtendedRelease) =>
						t("version.value", { version })
					}
				</Field>

				<Field fieldPath="name" label={t("name.label")}>
					{({ name }: ExtendedRelease) => t("name.value", { name })}
				</Field>

				<Field fieldPath="changelog" label={t("changelog.label")}>
					{({ changelog }: ExtendedRelease) =>
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
					{({ developmentReleasedOn }: ExtendedRelease) =>
						developmentReleasedOn
							? t("development-released-on.value", {
									developmentReleasedOn: new Date(
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
					{({ productionReleasedOn }: ExtendedRelease) =>
						t("production-released-on.value", {
							productionReleasedOn: new Date(productionReleasedOn)
						})
					}
				</Field>

				<Field
					fieldPath="isAvailableForTools"
					label={t("is-available-for-tools.label")}
				>
					{({ isAvailableForTools }: ExtendedRelease) =>
						t("is-available-for-tools.value", {
							context: isAvailableForTools ? "yes" : "no"
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
											pr.productionReleasedOn
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
