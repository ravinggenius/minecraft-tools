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
import { SupportedLocale } from "@/i18n/settings";

import styles from "./page.module.scss";

export const generateMetadata = async ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-table",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	};
};

export default async function DesignSystemTablePage({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) {
	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-table",
		{
			keyPrefix: "content"
		}
	);

	return (
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
	);
}
