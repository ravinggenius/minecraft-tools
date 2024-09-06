import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";

import styles from "./page.module.scss";

export const generateMetadata = async ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	const { t } = await loadPageTranslations(locale, "page-design-system", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function DesignSystemPage({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) {
	const { t } = await loadPageTranslations(locale, "page-design-system", {
		keyPrefix: "content"
	});

	const designElements: Array<{
		href: ComponentProps<typeof Anchor>["href"];
		text: ComponentProps<typeof Anchor>["children"];
	}> = [
		{
			href: `/${locale}/design-system/palette` as ComponentProps<
				typeof Anchor
			>["href"],
			text: t("table-of-contents.palette")
		},
		{
			href: `/${locale}/design-system/elevation` as ComponentProps<
				typeof Anchor
			>["href"],
			text: t("table-of-contents.elevation")
		},
		{
			href: `/${locale}/design-system/typography` as ComponentProps<
				typeof Anchor
			>["href"],
			text: t("table-of-contents.typography")
		},
		{
			href: `/${locale}/design-system/cards` as ComponentProps<
				typeof Anchor
			>["href"],
			text: t("table-of-contents.cards")
		},
		{
			href: `/${locale}/design-system/interactive` as ComponentProps<
				typeof Anchor
			>["href"],
			text: t("table-of-contents.interactive")
		},
		{
			href: `/${locale}/design-system/input` as ComponentProps<
				typeof Anchor
			>["href"],
			text: t("table-of-contents.input")
		},
		{
			href: `/${locale}/design-system/table` as ComponentProps<
				typeof Anchor
			>["href"],
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
