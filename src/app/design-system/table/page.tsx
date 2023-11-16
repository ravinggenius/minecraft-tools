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

import styles from "./page.module.scss";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-design-system-table", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function DesignSystemTablePage() {
	const { t } = await loadPageTranslations("page-design-system-table", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.article}>
			<p>{t("description")}</p>

			<header>
				<h1>{t("title")}</h1>
			</header>

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
		</article>
	);
}
