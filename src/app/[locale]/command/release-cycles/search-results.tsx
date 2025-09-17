import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import KeyValueCard from "@/components/Pagination/KeyValueCard/KeyValueCard";
import SearchResults from "@/components/SearchResults/SearchResults";
import { ExtendedReleaseCycle } from "@/domains/release-cycle/model";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResults({
	className,
	locale,
	releaseCycles,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	releaseCycles: Readonly<Array<ExtendedReleaseCycle>>;
	view: ComponentProps<typeof SearchResults>["view"];
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-component-compendium-release-cycles-results"
	);

	const mayEditReleaseCycle = await confirmAuthorization([
		"update",
		"any",
		"release-cycle"
	]);

	return (
		<SearchResults {...{ className, locale, view }} records={releaseCycles}>
			<SearchResults.List>
				{(releaseCycle: ExtendedReleaseCycle) => (
					<KeyValueCard
						{...{ locale }}
						href={
							mayEditReleaseCycle
								? `/${locale}/command/release-cycles/${releaseCycle.id}`
								: undefined
						}
						pairs={[
							{
								key: t("releases-count.label"),
								value: t("releases-count.value", {
									count: releaseCycle.releasesCount
								})
							},
							,
							{
								key: t("editions.label"),
								value: releaseCycle.editions.map((edition) =>
									t("editions.value", { context: edition })
								)
							}
						]}
						title={t("list.card.title", {
							name: releaseCycle.name
						})}
						variant="flat"
					/>
				)}
			</SearchResults.List>

			<SearchResults.Table
				caption={t("table.caption", { count: releaseCycles.length })}
			>
				<Field fieldPath="name" label={t("name.label")}>
					{({ id, name }: ExtendedReleaseCycle) =>
						mayEditReleaseCycle ? (
							<Anchor
								href={`/${locale}/command/release-cycles/${id}`}
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
					{({ releasesCount }: ExtendedReleaseCycle) =>
						t("releases-count.value", { count: releasesCount })
					}
				</Field>

				<Field fieldPath="editions" label={t("editions.label")}>
					{({ editions }: ExtendedReleaseCycle) => (
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
