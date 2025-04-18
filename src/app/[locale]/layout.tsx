import classNames from "classnames";
import { dir } from "i18next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";

import deleteSessionAction from "@/app/[locale]/(auth)/sessions/_actions/delete-session-action";
import { BREADCRUMB_TRAIL_ROOT_ID } from "@/components/BreadcrumbTrail/BreadcrumbTrailPortal";
import SiteDeck from "@/components/SiteDeck/SiteDeck";
import SiteStern from "@/components/SiteStern/SiteStern";
import { loadPageTranslations } from "@/i18n/server";
import { SUPPORTED_LOCALES } from "@/i18n/settings";
import { ensureParams, LOCALE_PARAMS as PARAMS } from "@/library/route-meta";
import {
	LayoutGenerateMetadata,
	LayoutProps
} from "@/library/route-meta.schema";
import { maybeProfileFromSession } from "@/library/session-manager";

import "../globals.scss";

import styles from "./layout.module.scss";

const notoSans = Noto_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: "400"
});

const notoSansMono = Noto_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-mono"
});

export const generateMetadata: LayoutGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(locale, "layout-root", {
		keyPrefix: "metadata"
	});

	return {
		title: {
			default: t("title.default"),
			template: t("title.template")
		},
		description: t("description")
	};
};

export const generateStaticParams = () =>
	SUPPORTED_LOCALES.map((locale) => ({
		locale
	}));

export default async function Layout({ children, params }: LayoutProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const maybeProfile = await maybeProfileFromSession();

	return (
		<html
			className={classNames(notoSans.variable, notoSansMono.variable)}
			dir={dir(locale)}
			lang={locale}
		>
			<body>
				<div className={styles["app-root"]}>
					<SiteDeck
						{...{ deleteSessionAction, locale }}
						profile={maybeProfile}
					/>

					<div id={BREADCRUMB_TRAIL_ROOT_ID} />

					<main className={styles.main}>{children}</main>

					<SiteStern {...{ locale }} />
				</div>
			</body>
		</html>
	);
}
