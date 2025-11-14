import Anchor, { AnchorHref, AnchorProps } from "@/components/Anchor/Anchor";
import { SupportedLocale } from "@/i18n/settings";

import styles from "./TableOfContents.module.scss";

export interface TableOfContentsEntry {
	href: AnchorHref<SupportedLocale>;
	text: AnchorProps<SupportedLocale>["children"];
}

export default function TableOfContents({
	className,
	description,
	entries
}: {
	className?: string;
	description: string;
	entries: Array<TableOfContentsEntry>;
}) {
	return (
		<nav>
			<p>{description}</p>

			{entries.length ? (
				<ol className={styles.list}>
					{entries.map(({ href, text }) => (
						<li className={styles.item} key={href.toString()}>
							<Anchor {...{ href }} variant="inline">
								{text}
							</Anchor>
						</li>
					))}
				</ol>
			) : null}
		</nav>
	);
}
