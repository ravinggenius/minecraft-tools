import { parseISO } from "date-fns";
import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import KeyValueCard from "@/components/Pagination/KeyValueCard/KeyValueCard";
import SearchResults from "@/components/SearchResults/SearchResults";
import { Release } from "@/domains/release/schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResults({
	className,
	locale,
	releases,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	releases: Readonly<Array<Release>>;
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
				{(release: Release) => (
					<KeyValueCard
						{...{ locale }}
						edition={release.edition}
						href={
							mayEditReleases
								? `/${locale}/command/releases/${release.id}`
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
								key: t("first-production-released-on.label"),
								value: release.changelog
									? {
											href: release.changelog,
											text: t(
												"first-production-released-on.value",
												{
													context:
														release.firstProductionReleasedOn
															? undefined
															: "upcoming",
													firstProductionReleasedOn:
														release.firstProductionReleasedOn
															? parseISO(
																	release.firstProductionReleasedOn
																)
															: undefined
												}
											),
											isExternal: true
										}
									: t("first-production-released-on.value", {
											context:
												release.firstProductionReleasedOn
													? undefined
													: "upcoming",
											firstProductionReleasedOn:
												release.firstProductionReleasedOn
													? parseISO(
															release.firstProductionReleasedOn
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
							release.platforms.length
								? {
										key: t("platform-releases.label"),
										value: release.platforms.map(
											({ name }) =>
												t("platform-name.value", {
													platformName: name
												})
										),
										isLarge: true
									}
								: undefined
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
					{({ edition }: Release) =>
						t("edition.value", { context: edition })
					}
				</Field>

				<Field fieldPath="version" label={t("version.label")}>
					{({ id, version }: Release) =>
						mayEditReleases ? (
							<Anchor
								href={`/${locale}/command/releases/${id}`}
								variant="inline"
							>
								{t("version.value", { version })}
							</Anchor>
						) : (
							t("version.value", { version })
						)
					}
				</Field>

				<Field fieldPath="name" label={t("name.label")}>
					{({ name }: Release) => t("name.value", { name })}
				</Field>

				<Field fieldPath="changelog" label={t("changelog.label")}>
					{({ changelog }: Release) =>
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
					{({ developmentReleasedOn }: Release) =>
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
					fieldPath="firstProductionReleasedOn"
					label={t("first-production-released-on.label")}
				>
					{({ firstProductionReleasedOn }: Release) =>
						firstProductionReleasedOn
							? t("first-production-released-on.value", {
									firstProductionReleasedOn: parseISO(
										firstProductionReleasedOn
									)
								})
							: null
					}
				</Field>

				{mayEditReleases ? (
					<Field
						fieldPath="isAvailableForTools"
						label={t("is-available-for-tools.label")}
					>
						{({ isAvailableForTools }: Release) =>
							t("is-available-for-tools.value", {
								context: isAvailableForTools ? "yes" : "no"
							})
						}
					</Field>
				) : null}

				<Field fieldPath="isLatest" label={t("is-latest.label")}>
					{({ isLatest }: Release) =>
						t("is-latest.value", {
							context: isLatest ? "yes" : "no"
						})
					}
				</Field>

				<Field
					fieldPath="platforms"
					label={t("platform-releases.label")}
				>
					{({ platforms }: Release) =>
						platforms.length ? (
							<ol>
								{platforms.map((p) => (
									<li key={p.platformId}>
										<span>
											{t("platform-name.value", {
												platformName: p.name
											})}
										</span>
										<span>
											{t("production-released-on.value", {
												productionReleasedOn: parseISO(
													p.productionReleasedOn
												)
											})}
										</span>
									</li>
								))}
							</ol>
						) : null
					}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
