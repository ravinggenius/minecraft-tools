import { Fragment } from "react";

import { Interactive } from "@/components/_/interactive/interactive";
import Anchor from "@/components/Anchor/Anchor";
import Button from "@/components/Button/Button";
import { loadPageTranslations } from "@/i18n/server";
import {
	ensureParams,
	PageGenerateMetadata,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

import styles from "./page.module.scss";

export const generateMetadata: PageGenerateMetadata = async ({ params }) => {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-interactive",
		{
			keyPrefix: "metadata"
		}
	);

	return {
		title: t("title")
	};
};

export default async function Page({ params }: PageProps) {
	const { locale } = await ensureParams(PARAMS, params);

	const { t } = await loadPageTranslations(
		locale,
		"page-design-system-interactive",
		{
			keyPrefix: "content"
		}
	);

	return (
		<section className={styles.examples}>
			{(
				["primary", "secondary", "inline"] as Array<
					Interactive["variant"]
				>
			).map((variant) => (
				<Fragment key={variant}>
					<div className={styles.example}>
						<Anchor {...{ variant }} href="#">
							{t("anchor", { variant })}
						</Anchor>
					</div>

					<div className={styles.example}>
						<Button {...{ variant }} type="button">
							{t("button", { variant })}
						</Button>
					</div>

					<div className={styles.example}>
						<Button {...{ variant }} disabled type="button">
							{t("button", { context: "disabled", variant })}
						</Button>
					</div>
				</Fragment>
			))}
		</section>
	);
}
