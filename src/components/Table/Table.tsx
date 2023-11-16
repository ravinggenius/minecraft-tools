import classNames from "classnames";
import {
	AllHTMLAttributes,
	ReactNode,
	TableHTMLAttributes,
	TdHTMLAttributes,
	ThHTMLAttributes
} from "react";

import styles from "./Table.module.scss";

export default function Table({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
} & TableHTMLAttributes<HTMLTableElement>) {
	return (
		<table className={classNames(styles.table, className)}>
			{children}
		</table>
	);
}

export function Caption({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableCaptionElement>) {
	return (
		<caption className={classNames(styles.caption, className)}>
			{children}
		</caption>
	);
}

export function TH({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
} & ThHTMLAttributes<HTMLTableCellElement>) {
	return <th className={classNames(styles.th, className)}>{children}</th>;
}

export function TD({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
} & TdHTMLAttributes<HTMLTableCellElement>) {
	return <td className={classNames(styles.td, className)}>{children}</td>;
}

export function TR({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableRowElement>) {
	return <tr className={classNames(styles.tr, className)}>{children}</tr>;
}

export function THead({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableSectionElement>) {
	return (
		<thead className={classNames(styles.thead, className)}>
			{children}
		</thead>
	);
}

export function TBody({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableSectionElement>) {
	return (
		<tbody className={classNames(styles.tbody, className)}>
			{children}
		</tbody>
	);
}

export function TFoot({
	children,
	className
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableSectionElement>) {
	return (
		<tfoot className={classNames(styles.tfoot, className)}>
			{children}
		</tfoot>
	);
}
