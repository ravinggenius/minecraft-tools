import classNames from "classnames";
import { ComponentProps, ReactElement } from "react";

import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { Identity } from "@/services/datastore-service/schema";

import DataList from "../DataList/DataList";
import DataTable from "../DataTable/DataTable";

import styles from "./SearchResults.module.scss";

const SearchList = <TRecord extends Identity>(
	_props: Pick<
		ComponentProps<typeof DataList<TRecord>>,
		"children" | "className"
	>
) => null;

const SearchTable = <TRecord extends Identity>(
	_props: Pick<
		ComponentProps<typeof DataTable<TRecord>>,
		"caption" | "children" | "className"
	>
) => null;

export default async function SearchResults<TRecord extends Identity>({
	children: [dataList, dataTable],
	className,
	locale,
	records,
	view
}: {
	children: [
		ReactElement<ComponentProps<typeof SearchList<TRecord>>>,
		ReactElement<ComponentProps<typeof SearchTable<TRecord>>>
	];
	className?: string;
	locale: SupportedLocale;
	records: Readonly<Array<TRecord>>;
	view: "list" | "table";
}) {
	const { t } = await loadPageTranslations(
		locale,
		"component-search-results"
	);

	return (
		<>
			{records.length === 0 ? (
				<p className={classNames(styles.root, styles.empty, className)}>
					{t("empty-results")}
				</p>
			) : null}

			{records.length && view === "list" ? (
				<DataList
					{...{ records }}
					className={classNames(
						styles.root,
						styles.list,
						className,
						dataList.props.className
					)}
				>
					{dataList.props.children}
				</DataList>
			) : null}

			{records.length && view === "table" ? (
				<DataTable
					{...{ locale, records }}
					caption={dataTable.props.caption}
					className={classNames(
						styles.root,
						styles.table,
						className,
						dataTable.props.className
					)}
				>
					{dataTable.props.children}
				</DataTable>
			) : null}
		</>
	);
}

SearchResults.List = SearchList;

SearchResults.Table = SearchTable;
