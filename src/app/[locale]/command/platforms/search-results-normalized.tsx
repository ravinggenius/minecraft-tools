import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import KeyValueCard from "@/components/Pagination/KeyValueCard/KeyValueCard";
import SearchResults from "@/components/SearchResults/SearchResults";
import { NormalizedPlatform } from "@/domains/platform/search.schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResultsNormalized({
	className,
	locale,
	platforms,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	platforms: Readonly<Array<NormalizedPlatform>>;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-compendium-platforms-results"
	);

	const mayEditPlatform = await confirmAuthorization([
		"update",
		"any",
		"platform"
	]);

	return (
		<SearchResults {...{ className, locale, view }} records={platforms}>
			<SearchResults.List>
				{(platform: NormalizedPlatform) => (
					<KeyValueCard
						{...{ locale }}
						href={
							mayEditPlatform
								? `/${locale}/command/platforms/${platform.id}`
								: undefined
						}
						pairs={[
							{
								key: t("releases-count.label"),
								value: t("releases-count.value", {
									count: Number(platform.releasesCount)
								})
							},
							{
								key: t("editions.label"),
								value: platform.editions.map((edition) =>
									t("editions.value", { context: edition })
								)
							},
							mayEditPlatform
								? {
										key: t("is-available-for-tools.label"),
										value: t(
											"is-available-for-tools.value",
											{
												context:
													platform.isAvailableForTools
														? "yes"
														: "no"
											}
										)
									}
								: undefined
						]}
						title={t("list.card.title", {
							name: platform.name
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: platforms.length })}
			>
				<Field fieldPath="name" label={t("name.label")}>
					{({ id, name }: NormalizedPlatform) =>
						mayEditPlatform ? (
							<Anchor
								href={`/${locale}/command/platforms/${id}`}
								variant="inline"
							>
								{t("name.value", { name })}
							</Anchor>
						) : (
							t("name.value", { name })
						)
					}
				</Field>

				<Field
					fieldPath="releasesCount"
					label={t("releases-count.label")}
				>
					{({ releasesCount }: NormalizedPlatform) =>
						t("releases-count.value", {
							count: Number(releasesCount)
						})
					}
				</Field>

				<Field fieldPath="editions" label={t("editions.label")}>
					{({ editions }: NormalizedPlatform) => (
						<ol>
							{editions.map((edition) => (
								<li key={edition}>
									{t("editions.value", { context: edition })}
								</li>
							))}
						</ol>
					)}
				</Field>

				{mayEditPlatform ? (
					<Field
						fieldPath="isAvailableForTools"
						label={t("is-available-for-tools.label")}
					>
						{({ isAvailableForTools }: NormalizedPlatform) =>
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
