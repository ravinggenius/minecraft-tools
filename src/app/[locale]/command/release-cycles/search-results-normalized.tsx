import { parseISO } from "date-fns";
import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import SearchResults from "@/components/SearchResults/SearchResults";
import StatsCard from "@/components/StatsCard/StatsCard";
import { NormalizedReleaseCycle } from "@/domains/release-cycle/search.schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResultsNormalized({
	className,
	locale,
	releaseCycles,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	releaseCycles: Readonly<Array<NormalizedReleaseCycle>>;
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
				{(releaseCycle: NormalizedReleaseCycle) => (
					<StatsCard
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
									count: Number(releaseCycle.releasesCount)
								})
							},
							{
								key: t("editions.label"),
								value: releaseCycle.editions.map((edition) =>
									t("editions.value", { context: edition })
								)
							},
							{
								key: t("first-production-released-on.label"),
								value: t("first-production-released-on.value", {
									context:
										releaseCycle.firstProductionReleasedOn
											? undefined
											: "upcoming",
									firstProductionReleasedOn:
										releaseCycle.firstProductionReleasedOn
											? parseISO(
													releaseCycle.firstProductionReleasedOn
												)
											: undefined
								})
							},
							mayEditReleaseCycle
								? {
										key: t("is-available-for-tools.label"),
										value: t(
											"is-available-for-tools.value",
											{
												context:
													releaseCycle.isAvailableForTools
														? "yes"
														: "no"
											}
										)
									}
								: undefined
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
					{({ id, name }: NormalizedReleaseCycle) =>
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
					{({ releasesCount }: NormalizedReleaseCycle) =>
						t("releases-count.value", {
							count: Number(releasesCount)
						})
					}
				</Field>

				<Field fieldPath="editions" label={t("editions.label")}>
					{({ editions }: NormalizedReleaseCycle) => (
						<ol>
							{editions.map((edition) => (
								<li key={edition}>
									{t("editions.value", { context: edition })}
								</li>
							))}
						</ol>
					)}
				</Field>

				<Field
					fieldPath="firstProductionReleasedOn"
					label={t("first-production-released-on.label")}
				>
					{({ firstProductionReleasedOn }: NormalizedReleaseCycle) =>
						firstProductionReleasedOn
							? t("first-production-released-on.value", {
									firstProductionReleasedOn: parseISO(
										firstProductionReleasedOn
									)
								})
							: null
					}
				</Field>

				{mayEditReleaseCycle ? (
					<Field
						fieldPath="isAvailableForTools"
						label={t("is-available-for-tools.label")}
					>
						{({ isAvailableForTools }: NormalizedReleaseCycle) =>
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
