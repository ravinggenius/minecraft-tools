import classNames from "classnames";
import { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import { ReactNode } from "react";

import BreadcrumbTrail from "@/components/BreadcrumbTrail/BreadcrumbTrail";
import SiteDeck from "@/components/SiteDeck/SiteDeck";
import SiteStern from "@/components/SiteStern/SiteStern";
import { extractLocaleFromRequest, translation } from "@/i18n/server";
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

export const generateMetadata = async () => {
	const { t } = await translation("layout-root", {
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
	children
}: {
	children: ReactNode;
}) {
	const { t } = await translation("layout-root", {
		keyPrefix: "content"
	});

	const locale = extractLocaleFromRequest();

	const maybeProfile = await maybeProfileFromSession();

	return (
		<html
			className={classNames(notoSans.variable, notoSansMono.variable)}
			lang={locale}
		>
			<body>
				<div className={styles["app-root"]}>
					<SiteDeck
						authentication={{
							signUpCta: t("authentication.sign-up-cta"),
							logInCta: t("authentication.log-in-cta")
						}}
						branding={{
							tagline: t("branding.tagline"),
							title: t("branding.title")
						}}
						profile={maybeProfile}
					/>

					<BreadcrumbTrail />

					<main className={styles.main}>{children}</main>

					<SiteStern />
				</div>
			</body>
		</html>
	);
}
