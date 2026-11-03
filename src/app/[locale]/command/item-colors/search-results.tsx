import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { NormalizedItemColor } from "@/domains/item-color/search.schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResults({
	className,
	itemColors,
	locale,
	view
}: {
	className?: string;
	itemColors: Readonly<Array<NormalizedItemColor>>;
	locale: SupportedLocale;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-command-item-colors-results"
	);

	const mayEditItemColor = await confirmAuthorization([
		"update",
		"any",
		"item-color"
	]);

	return (
		<SearchResults {...{ className, locale, view }} records={itemColors}>
			<SearchResults.List>
				{(itemColor: NormalizedItemColor) => (
					<StatsCard
						{...{ locale }}
						href={
							mayEditItemColor
								? `/${locale}/command/item-colors/${itemColor.id}`
								: undefined
						}
						pairs={[
							{
								key: t("identifier.label"),
								value: t("identifier.value", {
									identifier: itemColor.identifier
								}),
								isHighlighted: true,
								isLarge: true
							},
							{
								key: t("usage-count.label"),
								value: t("usage-count.value", {
									count: itemColor.usageCount
								})
							}
						]}
						title={t("list.card.title", {
							identifier: itemColor.identifier
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: itemColors.length })}
			>
				<Field fieldPath="identifier" label={t("identifier.label")}>
					{({ id, identifier }: NormalizedItemColor) =>
						mayEditItemColor ? (
							<Anchor
								href={`/${locale}/command/item-colors/${id}`}
								variant="inline"
							>
								{t("identifier.value", { identifier })}
							</Anchor>
						) : (
							t("identifier.value", { identifier })
						)
					}
				</Field>

				<Field fieldPath="usageCount" label={t("usage-count.label")}>
					{({ usageCount }: NormalizedItemColor) =>
						t("usage-count.value", { count: usageCount })
					}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
