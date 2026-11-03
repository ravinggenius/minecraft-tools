import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { NormalizedItemStackSize } from "@/domains/item-stack-size/search.schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResults({
	className,
	itemStackSizes,
	locale,
	view
}: {
	className?: string;
	itemStackSizes: Readonly<Array<NormalizedItemStackSize>>;
	locale: SupportedLocale;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-command-item-stack-sizes-results"
	);

	const mayEditItemStackSize = await confirmAuthorization([
		"update",
		"any",
		"item-stack-size"
	]);

	return (
		<SearchResults
			{...{ className, locale, view }}
			records={itemStackSizes}
		>
			<SearchResults.List>
				{(itemStackSize: NormalizedItemStackSize) => (
					<StatsCard
						{...{ locale }}
						href={
							mayEditItemStackSize
								? `/${locale}/command/item-stack-sizes/${itemStackSize.id}`
								: undefined
						}
						pairs={[
							{
								key: t("identifier.label"),
								value: t("identifier.value", {
									count: itemStackSize.identifier
								}),
								isHighlighted: true,
								isLarge: true
							},
							{
								key: t("usage-count.label"),
								value: t("usage-count.value", {
									count: itemStackSize.usageCount
								})
							}
						]}
						title={t("list.card.title", {
							count: itemStackSize.identifier
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: itemStackSizes.length })}
			>
				<Field fieldPath="identifier" label={t("identifier.label")}>
					{({ id, identifier }: NormalizedItemStackSize) =>
						mayEditItemStackSize ? (
							<Anchor
								href={`/${locale}/command/item-stack-sizes/${id}`}
								variant="inline"
							>
								{t("identifier.value", { count: identifier })}
							</Anchor>
						) : (
							t("identifier.value", { count: identifier })
						)
					}
				</Field>

				<Field fieldPath="usageCount" label={t("usage-count.label")}>
					{({ usageCount }: NormalizedItemStackSize) =>
						t("usage-count.value", { count: usageCount })
					}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
