import classNames from "classnames";
import { ReactNode } from "react";

import { Identity } from "@/services/datastore-service/schema";

import styles from "./DataList.module.scss";

export default function DataList<TRecord extends Identity>({
	children,
	className,
	records
}: {
	children: (record: TRecord) => ReactNode;
	className?: string;
	records: Readonly<Array<TRecord>>;
}) {
	return (
		<ol className={classNames(styles.root, className)}>
			{records.map((record) => (
				<li className={styles.item} key={record.id}>
					{children(record)}
				</li>
			))}
		</ol>
	);
}
