import classNames from "classnames";
import { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";

import BreadcrumbTrail from "@/components/BreadcrumbTrail/BreadcrumbTrail";
import SiteMasthead from "@/components/SiteMasthead/SiteMasthead";
import SiteStern from "@/components/SiteStern/SiteStern";
import TableOfContents from "@/components/TableOfContents/TableOfContents";

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

export const metadata: Metadata = {
	title: {
		default: "Minecraft Tools",
		template: "%s | Minecraft Tools"
	},
	description: "Unofficial reference and structured notes for Minecraft"
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			className={classNames(notoSans.variable, notoSansMono.variable)}
			lang="en_US"
		>
			<body>
				<div className={styles["app-root"]}>
					<SiteMasthead
						tagline="NOT official!"
						title="Unofficial Minecraft Tools"
					/>

					<TableOfContents />

					<BreadcrumbTrail />

					<main className={styles.main}>{children}</main>

					<SiteStern />
				</div>
			</body>
		</html>
	);
}
