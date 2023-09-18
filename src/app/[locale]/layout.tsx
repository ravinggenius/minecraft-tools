import classNames from "classnames";
import { dir } from "i18next";
import { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import { ComponentProps, ReactNode } from "react";

import { CommonPageProps } from "@/app/common-page-props";
import LocaleProvider from "@/components/_/LocaleProvider/LocaleProvider";
import BreadcrumbTrail from "@/components/BreadcrumbTrail/BreadcrumbTrail";
import SiteDeck from "@/components/SiteDeck/SiteDeck";
import SiteStern from "@/components/SiteStern/SiteStern";
import { loadPageTranslations } from "@/i18n/server";
import { SUPPORTED_LOCALES } from "@/i18n/settings";
import { maybeProfileFromSession } from "@/library/_/session";

import styles from "./layout.module.css";

import "./globals.css";

const notoSans = Noto_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: "400"
});

const notoSansMono = Noto_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-mono"
});

export const generateStaticParams = async () =>
	SUPPORTED_LOCALES.map((locale) => ({ locale }));

export const generateMetadata = async ({
	params: { locale }
}: ComponentProps<typeof RootLayout>) => {
	const { t } = await loadPageTranslations(locale, "layout", {
		keyPrefix: "metadata"
	});

	return {
		title: {
			default: t("title.default"),
			template: t("title.template")
		},
		description: t("description")
	} satisfies Metadata;
};

export default async function RootLayout({
	children,
	params: { locale }
}: {
	children: ReactNode;
} & CommonPageProps) {
	const maybeProfile = await maybeProfileFromSession();

	return (
		<html
			className={classNames(notoSans.variable, notoSansMono.variable)}
			dir={dir(locale)}
			lang={locale}
		>
			<body>
				<div className={styles["app-root"]}>
					<LocaleProvider {...{ locale }}>
						<SiteDeck profile={maybeProfile} />

						<BreadcrumbTrail />

						<main className={styles.main}>{children}</main>

						<SiteStern {...{ locale }} />
					</LocaleProvider>
				</div>
			</body>
		</html>
	);
}
