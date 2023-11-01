import { ComponentProps } from "react";

import Anchor from "@/components/Anchor/Anchor";
import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.css";

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
		}
	];

	return (
		<article className={styles.article}>
			<p>{t("description")}</p>

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
		</article>
	);
}
