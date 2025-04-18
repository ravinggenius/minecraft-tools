import BreadcrumbTrailPortal from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import { loadPageTranslations } from "@/i18n/server";
import { buildBreadcrumbsWithPrefix } from "@/library/breadcrumbs";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import { PageGenerateMetadata, PageProps } from "@/library/route-meta.schema";

import styles from "./page.module.scss";
import { BORDER_STYLES, RADIUS_STYLES, SHADOW_STYLES } from "./schema";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-elevation",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const crumbs = await buildBreadcrumbsWithPrefix(locale, [
		{ name: "design-system" },
		{ name: "elevation" }
	]);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-elevation",
		{
			keyPrefix: "content"
		}
	);

	return (
		<>
			<BreadcrumbTrailPortal {...{ crumbs }} />

			{BORDER_STYLES.map((borderStyle) => (
				<section key={borderStyle}>
					<header>
						<h2 className={styles.title}>
							{t(`border.${borderStyle}.title`)}
						</h2>
					</header>

					<div
						className={styles.sample}
						style={{
							// @ts-ignore custom properties are allowed
							"--border-width": `var(--border-${borderStyle}-width)`,
							"border": `var(--border-${borderStyle})`
						}}
					>
						<pre>{`--border-${borderStyle}`}</pre>
					</div>
				</section>
			))}

			{RADIUS_STYLES.map((radiusStyle) => (
				<section key={radiusStyle}>
					<header>
						<h2 className={styles.title}>
							{t(`radius.${radiusStyle}.title`)}
						</h2>
					</header>

					<div
						className={styles.sample}
						style={{
							// @ts-ignore custom properties are allowed
							"--border-width": "var(--border-thin-width)",
							"border": "var(--border-thin)",
							"borderRadius": `var(--radius-${radiusStyle})`
						}}
					>
						<pre>{`--border-${radiusStyle}`}</pre>
					</div>
				</section>
			))}

			{SHADOW_STYLES.map((shadowStyle) => (
				<section key={shadowStyle}>
					<header>
						<h2 className={styles.title}>
							{t(`shadow.${shadowStyle}.title`)}
						</h2>
					</header>

					<div
						className={styles.sample}
						style={{ boxShadow: `var(--shadow-${shadowStyle})` }}
					>
						<pre>{`--shadow-${shadowStyle}`}</pre>
					</div>
				</section>
			))}
		</>
	);
}
