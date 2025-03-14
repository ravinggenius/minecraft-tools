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
import { Option } from "../ObjectSelect/ObjectSelect";
import SelectField, { useSelectField } from "../SelectField/SelectField";
import TextField, { useTextField } from "../TextField/TextField";

import styles from "./SearchForm.module.scss";
import { Include, Keywords, Query, Ranges } from "./SearchForm.schema";

type ViewOption = Option;

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

	const viewOptions: Array<ViewOption> = [{ id: "list" }, { id: "table" }];

	const keyedViewOptions = viewOptions.reduce<
		Record<ViewOption["id"], ViewOption>
	>(
		(memo, option) => ({
			...memo,
			[option.id]: option
		}),
		{}
	);

	const q = useTextField({ fieldFeedback: {} }, "q", query.query);
	const v = useSelectField(
		{ fieldFeedback: {} },
		"v",
		viewOptions,
		keyedViewOptions[query.view]
	);
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
				serialize={(option) => option.id}
			>
				{(option) => t("view.options.label", { context: option.id })}
			</SelectField>

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
