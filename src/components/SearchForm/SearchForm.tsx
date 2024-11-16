"use client";

import classNames from "classnames";
import { Route } from "next";
import NextForm from "next/form";
import { usePathname } from "next/navigation";

import { useTranslation } from "@/i18n/client";

import Button from "../Button/Button";
import CheckboxField, {
	useCheckboxField
} from "../CheckboxField/CheckboxField";
import SelectField, { useSelectField } from "../SelectField/SelectField";
import TextField, { useTextField } from "../TextField/TextField";

import styles from "./SearchForm.module.scss";
import { Include, Keywords, Query, Ranges } from "./SearchForm.schema";

export default function SearchForm<
	TKeywords extends Keywords = Keywords,
	TRanges extends Ranges = Ranges,
	TInclude extends Include = Include,
	TQuery extends Query<TKeywords, TRanges, TInclude> = Query<
		TKeywords,
		TRanges,
		TInclude
	>
>({ className, query }: { className?: string; query: TQuery }) {
	const { t } = useTranslation("component-search-form");

	const pathname = usePathname();

	const q = useTextField({ fieldFeedback: {} }, "q", query.query);
	const v = useSelectField({ fieldFeedback: {} }, "v", query.view);
	const e = useCheckboxField({ fieldFeedback: {} }, "e", query.expand);

	return (
		<NextForm
			action={"" as Route}
			className={classNames(styles.form, className)}
		>
			<TextField
				{...q}
				className={styles.query}
				label={t("query.label")}
				type="search"
			/>

			<SelectField
				{...v}
				className={styles.view}
				label={t("view.label")}
				options={[
					{ id: "list", label: t("view.options.list") },
					{ id: "table", label: t("view.options.table") }
				]}
			/>

			<CheckboxField
				{...e}
				className={styles.expand}
				label={t("expand.label")}
			/>

			<Button className={styles.submit} type="submit" variant="primary">
				{t("submit.label")}
			</Button>

			<Button
				className={styles.reset}
				onClick={() => {
					window.location.href = pathname;
				}}
				type="reset"
				variant="secondary"
			>
				{t("reset.label")}
			</Button>
		</NextForm>
	);
}
