import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { NormalizedItem } from "@/domains/item/schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResults({
	className,
	items,
	locale,
	view
}: {
	className?: string;
	items: Readonly<Array<NormalizedItem>>;
	locale: SupportedLocale;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-command-items-results"
	);

	const mayEditItem = await confirmAuthorization(["update", "any", "item"]);

	return (
		<SearchResults {...{ className, locale, view }} records={items}>
			<SearchResults.List>
				{(item: NormalizedItem) => (
					<StatsCard
						{...{ locale }}
						href={
							mayEditItem
								? `/${locale}/command/items/${item.id}`
								: undefined
						}
						pairs={[
							{
								key: t("identifier.label"),
								value: t("identifier.value", {
									identifier: item.identifier
								}),
								isHighlighted: true,
								isLarge: true
							},
							item.isVariant
								? {
										key: t("variant.label"),
										value: t("variant.value", {
											variant: item.variant
										})
									}
								: undefined,
							item.color
								? {
										key: t("color.label"),
										value: t("color.value", {
											color: item.color
										})
									}
								: undefined,
							{
								key: t("rarity.label"),
								value: t("rarity.value", {
									rarity: item.rarity
								})
							},
							{
								key: t("stack-size.label"),
								value: t("stack-size.value", {
									count: item.stackSize
								})
							},
							item.translationKey
								? {
										key: t("translation-key.label"),
										value: t("translation-key.value", {
											translationKey: item.translationKey
										}),
										isLarge: true
									}
								: undefined
						]}
						title={t("list.card.title", {
							context: item.isVariant ? "is-variant" : undefined,
							identifier: item.identifier,
							variant: item.variant
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: items.length })}
			>
				<Field fieldPath="identifier" label={t("identifier.label")}>
					{({ id, identifier }: NormalizedItem) =>
						mayEditItem ? (
							<Anchor
								href={`/${locale}/command/items/${id}`}
								variant="inline"
							>
								{t("identifier.value", { identifier })}
							</Anchor>
						) : (
							t("identifier.value", { identifier })
						)
					}
				</Field>

				<Field fieldPath="variant" label={t("variant.label")}>
					{({ variant }: NormalizedItem) =>
						t("variant.value", { variant })
					}
				</Field>

				<Field fieldPath="color" label={t("color.label")}>
					{({ color }: NormalizedItem) => t("color.value", { color })}
				</Field>

				<Field fieldPath="rarity" label={t("rarity.label")}>
					{({ rarity }: NormalizedItem) =>
						t("rarity.value", { rarity })
					}
				</Field>

				<Field fieldPath="stackSize" label={t("stack-size.label")}>
					{({ stackSize }: NormalizedItem) =>
						t("stack-size.value", { count: stackSize })
					}
				</Field>

				<Field
					fieldPath="translationKey"
					label={t("translation-key.label")}
				>
					{({ translationKey }: NormalizedItem) =>
						t("translation-key.value", { translationKey })
					}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
