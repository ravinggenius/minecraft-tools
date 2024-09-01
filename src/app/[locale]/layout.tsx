import classNames from "classnames";
import { dir } from "i18next";
import { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import { ReactNode } from "react";

import deleteSessionAction from "@/app/[locale]/_actions/delete-session-action";
import BreadcrumbTrail from "@/components/BreadcrumbTrail/BreadcrumbTrail";
import SiteDeck from "@/components/SiteDeck/SiteDeck";
import SiteStern from "@/components/SiteStern/SiteStern";
import { loadPageTranslations } from "@/i18n/server";
import { SUPPORTED_LOCALES, SupportedLocale } from "@/i18n/settings";
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

export const generateMetadata = async ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	const { t } = await loadPageTranslations(locale, "layout-root", {
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

export const generateStaticParams = () =>
	SUPPORTED_LOCALES.map((locale) => ({
		locale
	}));

export default async function RootLayout({
	children,
	params: { locale }
}: {
	children: ReactNode;
	params: { locale: SupportedLocale };
}) {
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

					<BreadcrumbTrail />

					<main className={styles.main}>{children}</main>

					<SiteStern {...{ locale }} />
				</div>
			</body>
		</html>
	);
}
