import Anchor from "@/components/Anchor/Anchor";
import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { enforceAuthorization } from "@/library/authorization";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { PageGenerateMetadata, PageProps } from "@/library/route-meta.schema";

import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "page-command", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	await enforceAuthorization(["read", "any", "compendium"]);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "command" }
	]);

	const { t } = await loadPageTranslations(locale, "page-command", {
		keyPrefix: "content"
	});

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			<article className={styles.main}>
				<p>{t("description")}</p>

				<ol>
					<li>
						<Anchor
							href={`/${locale}/command/releases`}
							variant="inline"
						>
							{t("menu.releases")}
						</Anchor>
					</li>
				</ol>
			</article>
		</>
	);
}
