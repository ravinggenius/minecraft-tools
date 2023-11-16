import classNames from "classnames";
import { dir } from "i18next";
import { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import { ReactNode } from "react";

import BreadcrumbTrail from "@/components/BreadcrumbTrail/BreadcrumbTrail";
import SiteDeck from "@/components/SiteDeck/SiteDeck";
import SiteStern from "@/components/SiteStern/SiteStern";
import { extractLocaleFromRequest, loadPageTranslations } from "@/i18n/server";
import { maybeProfileFromSession } from "@/library/_/session";

import "./globals.scss";
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

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("layout-root", {
		keyPrefix: "metadata"
	});

	return {
		title: {
			default: t("title.default"),
			template: t("title.template")
		},
		description: t("description")
	} satisfies Metadata as Metadata;
};

export default async function RootLayout({
	children
}: {
	children: ReactNode;
}) {
	const locale = extractLocaleFromRequest();

	const maybeProfile = await maybeProfileFromSession();

	return (
		<html
			className={classNames(notoSans.variable, notoSansMono.variable)}
			dir={dir(locale)}
			lang={locale}
		>
			<body>
				<div className={styles["app-root"]}>
					<SiteDeck profile={maybeProfile} />

					<BreadcrumbTrail />

					<main className={styles.main}>{children}</main>

					<SiteStern />
				</div>
			</body>
		</html>
	);
}
