import { zodValidator } from "@tanstack/zod-form-adapter";
import { useForm as useTanStackForm } from "@tanstack/react-form";
import classNames from "classnames";
import { ComponentProps, forwardRef, ReactElement, Ref } from "react";
import { ZodSchema } from "zod"; // ZodError import removed

import Debug from "@/components/Debug/Debug";
import FeedbackList, { Feedback } from "@/components/FeedbackList/FeedbackList";
import Field from "@/components/Field/Field";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import { CodedErrorAttrs } from "@/library/coded-error";
import { ServerAction } from "@/library/server-action";

import styles from "./Form.module.scss";

type TanStackFormErrors = Record<string, any>;

const objectToFormData = (obj: Record<string, any>): FormData => {
	const formData = new FormData();
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key];
			if (value instanceof File) {
				formData.append(key, value, value.name);
			} else if (Array.isArray(value)) {
				value.forEach((item) => {
					if (item instanceof File) {
						formData.append(key, item, item.name);
					} else if (item !== null && item !== undefined) {
						formData.append(key, String(item));
					}
				});
			} else if (value !== null && value !== undefined) {
				formData.append(key, String(value));
			}
		}
	}
	return formData;
};

const extractFeedbackFrom = (
	errorInput: unknown
): TanStackFormErrors | null => {
	// ZodError case removed as it's handled by zodValidator adapter
	if (errorInput instanceof Error) {
		return { _global: errorInput.message };
	} else if (errorInput && typeof errorInput === "object") {
		const errObj = errorInput as Record<string, any>;

		if (typeof errObj.code === "string") {
			if (
				errObj.path &&
				Array.isArray(errObj.path) &&
				errObj.path.length > 0
			) {
				return { [errObj.path.join(".")]: errObj.code };
			}
			return { _global: errObj.code };
		}

		const keys = Object.keys(errObj);
		if (keys.length > 0) {
			let isLikelyErrorMap = true;
			for (const key of keys) {
				if (typeof errObj[key] !== "string") {
					isLikelyErrorMap = false;
					break;
				}
			}
			if (isLikelyErrorMap) return errObj as TanStackFormErrors;
		}
	}
	return null;
};

interface UseFormOptions<TData> {
	schema?: ZodSchema<TData>;
	defaultValues?: TData;
}

export const useForm = <TData extends Record<string, any> = {}>(
	serverAction: ServerAction<TData>,
	{ schema, defaultValues }: UseFormOptions<TData> = {}
) => {
	const form = useTanStackForm<TData, TanStackFormErrors>({
		defaultValues: defaultValues ?? ({} as TData),
		validatorAdapter: zodValidator(),
		zodSchema: schema, // Pass schema for form-level validation
		onSubmit: async ({ value }) => {
			// `value` is now the validated data from Zod schema if one was provided
			try {
				// Manual Zod validation block is removed.
				// `objectForFormDataConversion` is now just `value` as it's already validated.
				const formDataToSend = objectToFormData(value);
				const reply = await serverAction(formDataToSend);

				if (reply) {
					const serverErrors = extractFeedbackFrom(reply);
					if (serverErrors) {
						const keys = Object.keys(serverErrors);
						if (keys.length > 0) {
							form.setErrors(serverErrors);
							throw new Error("Server action returned errors.");
						}
					}
				}
			} catch (error: any) {
				// "Validation failed" error is no longer thrown from here for Zod issues
				// as onSubmit is not called if zodValidator fails.
				if (error.message === "Server action returned errors.") {
					return;
				}
				const generalErrors = extractFeedbackFrom(error);
				if (generalErrors) {
					form.setErrors(generalErrors);
				} else {
					form.setErrors({
						_global: "An unexpected error occurred during submission."
					});
				}
			}
		}
	});

	return form;
};

export type AppFormInstance<TData extends Record<string, any>> = ReturnType<
	typeof useForm<TData>
>;

export default forwardRef(function ActionForm<
	TData extends Record<string, any>
>(
	{
		form,
		children,
		className,
		debug = false,
		submitLabel,
		submitVariant
	}: {
		form: AppFormInstance<TData>;
		children?:
			| ReactElement<ComponentProps<typeof Field>>
			| Array<ReactElement<ComponentProps<typeof Field>>>;
		className?: string;
		debug?: boolean;
		submitLabel: ComponentProps<typeof SubmitButton>["label"];
		submitVariant?: ComponentProps<typeof SubmitButton>["variant"];
	},
	ref: Ref<HTMLFormElement>
) {
	const globalErrorFromState = form.state.errorMap?._global;
	const globalFeedback: Feedback[] = [];
	if (globalErrorFromState) {
		const errors = Array.isArray(globalErrorFromState)
			? globalErrorFromState
			: [globalErrorFromState];
		errors.forEach((err) =>
			globalFeedback.push({ message: String(err), type: "negative" })
		);
	}

	return (
		<form
			ref={ref}
			className={classNames(styles.form, className)}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<FeedbackList feedback={globalFeedback} />

			{children}

			<SubmitButton
				label={submitLabel}
				variant={submitVariant}
				isSubmitting={form.state.isSubmitting}
			/>

			{debug ? <Debug value={form.state} /> : null}
		</form>
	);
});
