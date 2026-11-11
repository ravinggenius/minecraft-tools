import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { NormalizedItemIdentity } from "@/domains/item-identity/search.schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResults({
	className,
	itemIdentities,
	locale,
	view
}: {
	className?: string;
	itemIdentities: Readonly<Array<NormalizedItemIdentity>>;
	locale: SupportedLocale;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-command-item-identities-results"
	);

	const mayEditItemIdentity = await confirmAuthorization([
		"update",
		"any",
		"item-identity"
	]);

	return (
		<SearchResults
			{...{ className, locale, view }}
			records={itemIdentities}
		>
			<SearchResults.List>
				{(itemIdentity: NormalizedItemIdentity) => (
					<StatsCard
						{...{ locale }}
						href={
							mayEditItemIdentity
								? `/${locale}/command/item-identities/${itemIdentity.id}`
								: undefined
						}
						pairs={[
							{
								key: t("identifier.label"),
								value: t("identifier.value", {
									identifier: itemIdentity.identifier
								}),
								isHighlighted: true,
								isLarge: true
							},
							itemIdentity.isVariant
								? {
										key: t("variant.label"),
										value: t("variant.value", {
											variant: itemIdentity.variant
										})
									}
								: undefined,
							{
								key: t("is-variant.label"),
								value: t("is-variant.value", {
									context: itemIdentity.isVariant
										? "yes"
										: "no"
								})
							},
							{
								key: t("usage-count.label"),
								value: t("usage-count.value", {
									count: itemIdentity.usageCount
								})
							}
						]}
						title={t("list.card.title", {
							context: itemIdentity.isVariant
								? "is-variant"
								: undefined,
							identifier: itemIdentity.identifier,
							variant: itemIdentity.variant
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: itemIdentities.length })}
			>
				<Field fieldPath="identifier" label={t("identifier.label")}>
					{({ id, identifier }: NormalizedItemIdentity) =>
						mayEditItemIdentity ? (
							<Anchor
								href={`/${locale}/command/item-identities/${id}`}
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
					{({ variant }: NormalizedItemIdentity) =>
						t("variant.value", { variant })
					}
				</Field>

				<Field fieldPath="isVariant" label={t("is-variant.label")}>
					{({ isVariant }: NormalizedItemIdentity) =>
						t("is-variant.value", {
							context: isVariant ? "yes" : "no"
						})
					}
				</Field>

				<Field fieldPath="usageCount" label={t("usage-count.label")}>
					{({ usageCount }: NormalizedItemIdentity) =>
						t("usage-count.value", { count: usageCount })
					}
				</Field>
			</SearchResults.Table>
		</SearchResults>
	);
}
