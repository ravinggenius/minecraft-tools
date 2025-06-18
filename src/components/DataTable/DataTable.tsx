import classNames from "classnames";
import { path } from "rambda";
import { Children, ComponentProps, ReactElement, ReactNode } from "react";

import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import { Identity } from "@/services/datastore-service/schema";

import Table, {
	Caption,
	TBody,
	TD,
	TFoot,
	TH,
	THead,
	TR
} from "../Table/Table";

import styles from "./DataTable.module.scss";

type ValidPath<T> = T extends {}
	? {
			[K in keyof T]: K extends string
				? `${K}` | `${K}.${ValidPath<T[K]>}`
				: never;
		}[keyof T]
	: never;

export const Field = <TRecord extends Identity>(_props: {
	children?: (record: TRecord) => ReactNode;
	fieldPath: ValidPath<TRecord>;
	header?: boolean;
	label?: ReactNode;
}) => null;

type FieldProps<TRecord extends Identity> = ComponentProps<
	typeof Field<TRecord>
>;

export default async function DataTable<TRecord extends Identity>({
	caption,
	children: fields,
	className,
	locale,
	records
}: {
	caption: ReactNode;
	children:
		| ReactElement<FieldProps<TRecord>>
		| Array<ReactElement<FieldProps<TRecord>>>;
	className?: string;
	locale: SupportedLocale;
	records: Readonly<Array<TRecord>>;
}) {
	const { t } = await loadPageTranslations(locale, "component-data-table");

	return (
		<Table className={classNames(styles.root, className)}>
			<Caption>{caption}</Caption>

			<THead>
				<TR>
					{Children.map(fields, (field) => (
						<TH key={field.key}>{field.props.label}</TH>
					))}
				</TR>
			</THead>

			<TFoot>
				<TR>
					<TD colSpan={Children.count(fields)}>
						{t("records-count", { count: records.length })}
					</TD>
				</TR>
			</TFoot>

			<TBody>
				{records.map((record) => (
					<TR key={record.id}>
						{Children.map(fields, (field) => {
							const Cell = field.props.header ? TH : TD;

							return (
								<Cell key={field.props.fieldPath}>
									{field.props.children
										? field.props.children(record)
										: path(
												// @ts-expect-error
												field.props.fieldPath
											)(record)}
								</Cell>
							);
						})}
					</TR>
				))}
			</TBody>
		</Table>
	);
}
