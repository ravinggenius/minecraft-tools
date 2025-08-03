"use client";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import AppTextField from "@/components/TextField/AppTextField";

export const { fieldContext, formContext, useFieldContext } =
	createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField: AppTextField
	},
	fieldContext,
	formComponents: {},
	formContext
});
