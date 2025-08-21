import { Metadata } from "next";

import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import Table, {
	Caption,
	TBody,
	TD,
	TFoot,
	TH,
	THead,
	TR
} from "@/components/Table/Table";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata = async ({
	params
}: PageProps<"/[locale]/design-system/table">) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-table",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	} satisfies Metadata as Metadata;
};

export default async function Page({
	params
}: PageProps<"/[locale]/design-system/table">) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "design-system" },
		{ name: "table" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-table",
		{
			keyPrefix: "content"
		}
	);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<section>
				<Table>
					<Caption>{t("table.caption")}</Caption>

					<THead>
						<TR>
							<TH>{t("table.headers.scientific")}</TH>
							<TH>{t("table.headers.common")}</TH>
						</TR>
					</THead>

					<TFoot>
						<TR>
							<TD colSpan={2}>{t("table.footer")}</TD>
						</TR>
					</TFoot>

					<TBody>
						{["bowfin", "eel", "mammal", "stork", "shark"].map(
							(code) => (
								<TR key={code}>
									<TD>
										<em>
											{t(`table.body.${code}.scientific`)}
										</em>
									</TD>
									<TD>{t(`table.body.${code}.common`)}</TD>
								</TR>
							)
						)}
					</TBody>
				</Table>
			</section>
		</>
	);
}
