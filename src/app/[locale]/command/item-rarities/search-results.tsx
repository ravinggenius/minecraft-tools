import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { NormalizedItemRarity } from "@/domains/item-rarity/search.schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResults({
	className,
	itemRarities,
	locale,
	view
}: {
	className?: string;
	itemRarities: Readonly<Array<NormalizedItemRarity>>;
	locale: SupportedLocale;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-command-item-rarities-results"
	);

	const mayEditItemRarity = await confirmAuthorization([
		"update",
		"any",
		"item-rarity"
	]);

	return (
		<SearchResults {...{ className, locale, view }} records={itemRarities}>
			<SearchResults.List>
				{(itemRarity: NormalizedItemRarity) => (
					<StatsCard
						{...{ locale }}
						href={
							mayEditItemRarity
								? `/${locale}/command/item-rarities/${itemRarity.id}`
								: undefined
						}
						pairs={[
							{
								key: t("identifier.label"),
								value: t("identifier.value", {
									identifier: itemRarity.identifier
								}),
								isHighlighted: true,
								isLarge: true
							},
							{
								key: t("usage-count.label"),
								value: t("usage-count.value", {
									count: itemRarity.usageCount
								})
							}
						]}
						title={t("list.card.title", {
							identifier: itemRarity.identifier
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: itemRarities.length })}
			>
				<Field fieldPath="identifier" label={t("identifier.label")}>
					{({ id, identifier }: NormalizedItemRarity) =>
						mayEditItemRarity ? (
							<Anchor
								href={`/${locale}/command/item-rarities/${id}`}
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
					{({ usageCount }: NormalizedItemRarity) =>
						t("usage-count.value", { count: usageCount })
					}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
