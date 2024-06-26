import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.scss";

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

	const designElements: Array<{
		href: ComponentProps<typeof Anchor>["href"];
		text: ComponentProps<typeof Anchor>["children"];
	}> = [
		{
			href: "/design-system/palette",
			text: t("table-of-contents.palette")
		},
		{
			href: "/design-system/elevation",
			text: t("table-of-contents.elevation")
		},
		{
			href: "/design-system/typography",
			text: t("table-of-contents.typography")
		},
		{
			href: "/design-system/cards",
			text: t("table-of-contents.cards")
		},
		{
			href: "/design-system/interactive",
			text: t("table-of-contents.interactive")
		},
		{
			href: "/design-system/input",
			text: t("table-of-contents.input")
		},
		{
			href: "/design-system/table",
			text: t("table-of-contents.table")
		}
	];

	return (
		<nav>
			<ol>
				{designElements.map(({ href, text }) => (
					<li key={href}>
						<Anchor {...{ href }} variant="inline">
							{text}
						</Anchor>
					</li>
				))}
			</ol>
		</nav>
	);
}
