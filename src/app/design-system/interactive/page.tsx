import { Fragment } from "react";

import { Interactive } from "@/components/_/interactive/interactive";
import Anchor from "@/components/Anchor/Anchor";
import Button from "@/components/Button/Button";
import { loadPageTranslations } from "@/i18n/server";

import styles from "./page.module.css";

export const generateMetadata = async () => {
	const { t } = await loadPageTranslations("page-design-system-interactive", {
		keyPrefix: "metadata"
	});

	return {
		title: t("title")
	};
};

export default async function DesignSystemInteractivePage() {
	const { t } = await loadPageTranslations("page-design-system-interactive", {
		keyPrefix: "content"
	});

	return (
		<article className={styles.article}>
			<p>{t("description")}</p>

			<header>
				<h1>{t("title")}</h1>
			</header>

			<section className={styles.examples}>
				{(
					["primary", "secondary", "inline"] as Array<
						Interactive["variant"]
					>
				).map((variant) => (
					<Fragment key={variant}>
						<div className={styles.example}>
							<Anchor {...{ variant }} href="#">
								{`${variant} Anchor`}
							</Anchor>
						</div>

						<div className={styles.example}>
							<Button {...{ variant }} type="button">
								{`${variant} Button`}
							</Button>
						</div>
					</Fragment>
				))}
			</section>
		</article>
	);
}
