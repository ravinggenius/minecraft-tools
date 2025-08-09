"use client";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import AppCheckboxField from "@/components/CheckboxField/AppCheckboxField";
import AppSelectField from "@/components/SelectField/AppSelectField";
import AppTextField from "@/components/TextField/AppTextField";

export const { fieldContext, formContext, useFieldContext } =
	createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		CheckboxField: AppCheckboxField,
		SelectField: AppSelectField,
		TextField: AppTextField
	},
	fieldContext,
	formComponents: {},
	formContext
});
