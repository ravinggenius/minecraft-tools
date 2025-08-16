import { ComponentProps } from "react";

import { Field } from "@/components/DataTable/DataTable";
import KeyValueCard from "@/components/Pagination/KeyValueCard/KeyValueCard";
import SearchResults from "@/components/SearchResults/SearchResults";
import { ExtendedPlatform } from "@/domains/platform/model";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

export default async function PageSearchResults({
	className,
	locale,
	platforms,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	platforms: Readonly<Array<ExtendedPlatform>>;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-compendium-platforms-results"
	);

	return (
		<SearchResults {...{ className, locale, view }} records={platforms}>
			<SearchResults.List>
				{(platform: ExtendedPlatform) => (
					<KeyValueCard
						{...{ locale }}
						pairs={[
							{
								key: t("releases-count.label"),
								value: t("releases-count.value", {
									count: platform.releasesCount
								})
							},
							{
								key: t("editions.label"),
								value: platform.editions.map((edition) =>
									t("editions.value", { context: edition })
								),
								isLarge: true
							}
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
					{({ name }: ExtendedPlatform) => t("name.value", { name })}
				</Field>

				<Field
					fieldPath="releasesCount"
					label={t("releases-count.label")}
				>
					{({ releasesCount }: ExtendedPlatform) =>
						t("releases-count.value", { count: releasesCount })
					}
				</Field>

				<Field fieldPath="editions" label={t("editions.label")}>
					{({ editions }: ExtendedPlatform) => (
						<ol>
							{editions.map((edition) => (
								<li key={edition}>
									{t("editions.value", { context: edition })}
								</li>
							))}
						</ol>
					)}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
