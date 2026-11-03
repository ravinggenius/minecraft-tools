import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { NormalizedItemTranslationKey } from "@/domains/item-translation-key/search.schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResults({
	className,
	itemTranslationKeys,
	locale,
	view
}: {
	className?: string;
	itemTranslationKeys: Readonly<Array<NormalizedItemTranslationKey>>;
	locale: SupportedLocale;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-command-item-translation-keys-results"
	);

	const mayEditItemTranslationKey = await confirmAuthorization([
		"update",
		"any",
		"item-translation-key"
	]);

	return (
		<SearchResults
			{...{ className, locale, view }}
			records={itemTranslationKeys}
		>
			<SearchResults.List>
				{(itemTranslationKey: NormalizedItemTranslationKey) => (
					<StatsCard
						{...{ locale }}
						href={
							mayEditItemTranslationKey
								? `/${locale}/command/item-translation-keys/${itemTranslationKey.id}`
								: undefined
						}
						pairs={[
							{
								key: t("identifier.label"),
								value: t("identifier.value", {
									identifier: itemTranslationKey.identifier
								}),
								isHighlighted: true,
								isLarge: true
							},
							{
								key: t("usage-count.label"),
								value: t("usage-count.value", {
									count: itemTranslationKey.usageCount
								})
							}
						]}
						title={t("list.card.title", {
							identifier: itemTranslationKey.identifier
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", {
					count: itemTranslationKeys.length
				})}
			>
				<Field fieldPath="identifier" label={t("identifier.label")}>
					{({ id, identifier }: NormalizedItemTranslationKey) =>
						mayEditItemTranslationKey ? (
							<Anchor
								href={`/${locale}/command/item-translation-keys/${id}`}
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
					{({ usageCount }: NormalizedItemTranslationKey) =>
						t("usage-count.value", { count: usageCount })
					}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
