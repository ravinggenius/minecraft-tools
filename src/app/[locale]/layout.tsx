import classNames from "classnames";
import { dir } from "i18next";
import { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import { ReactNode } from "react";

import { SUPPORTED_LOCALES, SupportedLocale } from "@/app/i18n/settings";
import BreadcrumbTrail from "@/components/BreadcrumbTrail/BreadcrumbTrail";
import SiteDeck from "@/components/SiteDeck/SiteDeck";
import SiteStern from "@/components/SiteStern/SiteStern";
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

export const metadata = {
	title: {
		default: "Minecraft Tools",
		template: "%s | Minecraft Tools"
	},
	description: "Unofficial reference and structured notes for Minecraft"
} satisfies Metadata;

export default async function RootLayout({
	children,
	params: { locale }
}: {
	children: ReactNode;
	params: {
		locale: SupportedLocale;
	};
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
					<SiteDeck profile={maybeProfile} />

					<BreadcrumbTrail />

					<main className={styles.main}>{children}</main>

					<SiteStern />
				</div>
			</body>
		</html>
	);
}
