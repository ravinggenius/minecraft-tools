import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-design-system", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function DesignSystemPage() {
	const { t } = await loadPageTranslations("page-design-system", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.article}>
			<p>{t("description")}</p>

			<nav>
				<ol>
					<li>
						<Anchor href="/design-system/palette" variant="inline">
							{t("table-of-contents.palette")}
						</Anchor>
					</li>
				</ol>
			</nav>
		</article>
	);
}
