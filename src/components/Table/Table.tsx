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
	className,
	...rest
}: {
	children: ReactNode;
	className?: string;
} & TableHTMLAttributes<HTMLTableElement>) {
	return (
		<div className={styles.wrapper}>
			<table {...rest} className={classNames(styles.table, className)}>
				{children}
			</table>
		</div>
	);
}

export function Caption({
	children,
	className,
	...rest
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableCaptionElement>) {
	return (
		<caption {...rest} className={classNames(styles.caption, className)}>
			{children}
		</caption>
	);
}

export function TH({
	children,
	className,
	...rest
}: {
	children: ReactNode;
	className?: string;
} & ThHTMLAttributes<HTMLTableCellElement>) {
	return (
		<th {...rest} className={classNames(styles.th, className)}>
			{children}
		</th>
	);
}

export function TD({
	children,
	className,
	...rest
}: {
	children: ReactNode;
	className?: string;
} & TdHTMLAttributes<HTMLTableCellElement>) {
	return (
		<td {...rest} className={classNames(styles.td, className)}>
			{children}
		</td>
	);
}

export function TR({
	children,
	className,
	...rest
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableRowElement>) {
	return (
		<tr {...rest} className={classNames(styles.tr, className)}>
			{children}
		</tr>
	);
}

export function THead({
	children,
	className,
	...rest
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableSectionElement>) {
	return (
		<thead {...rest} className={classNames(styles.thead, className)}>
			{children}
		</thead>
	);
}

export function TBody({
	children,
	className,
	...rest
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableSectionElement>) {
	return (
		<tbody {...rest} className={classNames(styles.tbody, className)}>
			{children}
		</tbody>
	);
}

export function TFoot({
	children,
	className,
	...rest
}: {
	children: ReactNode;
	className?: string;
} & AllHTMLAttributes<HTMLTableSectionElement>) {
	return (
		<tfoot {...rest} className={classNames(styles.tfoot, className)}>
			{children}
		</tfoot>
	);
}
