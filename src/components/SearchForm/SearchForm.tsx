"use client";

import { useForm } from "@tanstack/react-form";
import classNames from "classnames";
// Route import is not needed as we are not using NextForm action
import { usePathname } from "next/navigation";

import { useTranslation } from "@/i18n/client";

import Button from "../Button/Button";
import CheckboxField from "../CheckboxField/CheckboxField"; // Refactored
import { Option as ViewOption } from "../ObjectSelect/ObjectSelect"; // Option can be aliased or used directly
import SelectField from "../SelectField/SelectField"; // Refactored
import TextField from "../TextField/TextField"; // Refactored

import styles from "./SearchForm.module.scss";
import { Include, Keywords, Query, Ranges } from "./SearchForm.schema";

// Interface for form values
interface SearchFormValues {
	q: string;
	v: string; // View option ID (e.g., "list", "table")
	e: boolean; // Expand flag
}

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

	const viewOptions: Array<ViewOption> = [
		{ id: "list" },
		{ id: "table" }
	];

	const form = useForm<SearchFormValues>({
		defaultValues: {
			q: query.query || "",
			v: query.view || "list", // Default to 'list' view
			e: query.expand || false
		},
		onSubmit: async ({ value }) => {
			const params = new URLSearchParams();
			if (value.q) params.set("q", value.q);
			if (value.v) params.set("v", value.v);
			// Only add 'e' to params if it's true, to keep URL cleaner
			if (value.e) params.set("e", "true");

			const queryString = params.toString();
			window.location.href = queryString ? `${pathname}?${queryString}` : pathname;
		}
	});

	return (
		<form
			className={classNames(styles.form, className)}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<TextField
				form={form}
				name="q"
				className={styles.query}
				label={t("query.label")}
				type="search"
				// No need to pass value or onChange, handled by form.Field in TextField
			/>

			<SelectField
				form={form}
				name="v"
				className={styles.view}
				label={t("view.label")}
				options={viewOptions}
				serialize={(option) => option.id}
				// No need for initial value, defaultValues in useForm handles this
			>
				{(option) => t("view.options.label", { context: option.id })}
			</SelectField>

			<CheckboxField
				form={form}
				name="e"
				className={styles.expand}
				label={t("expand.label")}
				// No need for initial checked, defaultValues in useForm handles this
			/>

			<Button
				className={styles.submit}
				type="submit"
				variant="primary"
				disabled={!form.state.canSubmit || form.state.isSubmitting}
			>
				{form.state.isSubmitting
					? t("submitting.label", "Searching...") // Provide a default for submitting label
					: t("submit.label")}
			</Button>

			<Button
				className={styles.reset}
				onClick={() => {
					// This clears URL query parameters and reloads.
					// form.reset() would reset to defaultValues if that was desired.
					window.location.href = pathname;
				}}
				type="button" // Changed from "reset" to avoid native form reset
				variant="secondary"
			>
				{t("reset.label")}
			</Button>
		</form>
	);
}
