import { parseISO } from "date-fns";
import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { Field } from "@/components/DataTable/DataTable";
import KeyValueCard from "@/components/Pagination/KeyValueCard/KeyValueCard";
import SearchResults from "@/components/SearchResults/SearchResults";
import { FlattenedReleaseCycle } from "@/domains/release-cycle/search.schema";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { confirmAuthorization } from "@/library/authorization";

export default async function PageSearchResultsFlattened({
	className,
	locale,
	releaseCycles,
	view
}: {
	className?: string;
	locale: SupportedLocale;
	releaseCycles: Readonly<Array<FlattenedReleaseCycle>>;
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
				{(releaseCycle: FlattenedReleaseCycle) => (
					<KeyValueCard
						{...{ locale }}
						href={
							mayEditReleaseCycle
								? `/${locale}/command/release-cycles/${releaseCycle.id}`
								: undefined
						}
						pairs={[
							{
								key: t("edition.label"),
								value: t("edition.value", {
									context: releaseCycle.release?.edition
								})
							},
							{
								key: t("version.label"),
								value: t("version.value", {
									version: releaseCycle.release?.version
								})
							},
							{
								key: t("production-released-on.label"),
								value: t("production-released-on.value", {
									context: releaseCycle.release
										?.productionReleasedOn
										? undefined
										: "upcoming",
									productionReleasedOn: releaseCycle.release
										?.productionReleasedOn
										? parseISO(
												releaseCycle.release
													.productionReleasedOn
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
												context: releaseCycle.release
													?.isAvailableForTools
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
					{({ id, name }: FlattenedReleaseCycle) =>
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

				<Field fieldPath="releases.edition" label={t("edition.label")}>
					{({ release }: FlattenedReleaseCycle) =>
						release
							? t("edition.value", { context: release.edition })
							: null
					}
				</Field>

				<Field fieldPath="releases.version" label={t("version.label")}>
					{({ release }: FlattenedReleaseCycle) =>
						release
							? t("version.value", { version: release.version })
							: null
					}
				</Field>

				<Field
					fieldPath="releases.productionReleasedOn"
					label={t("production-released-on.label")}
				>
					{({ release }: FlattenedReleaseCycle) =>
						release
							? t("production-released-on.value", {
									context: release.productionReleasedOn
										? undefined
										: "upcoming",
									productionReleasedOn:
										release.productionReleasedOn
											? parseISO(
													release.productionReleasedOn
												)
											: undefined
								})
							: null
					}
				</Field>

				{mayEditReleaseCycle ? (
					<Field
						fieldPath="release.isAvailableForTools"
						label={t("is-available-for-tools.label")}
					>
						{({ release }: FlattenedReleaseCycle) =>
							t("is-available-for-tools.value", {
								context: release?.isAvailableForTools
									? "yes"
									: "no"
							})
						}
					</Field>
				) : null}
			</SearchResults.Table>
		</SearchResults>
	);
}
