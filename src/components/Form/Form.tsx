import { AnyFormApi } from "@tanstack/react-form";
import classNames from "classnames";
import NextForm from "next/form";
import { ComponentProps, forwardRef, ReactElement, Ref, useState } from "react";
import { createContext } from "react";
import { ZodError } from "zod/v4";

import Debug from "@/components/Debug/Debug";
import FeedbackList, { Feedback } from "@/components/FeedbackList/FeedbackList";
import Field from "@/components/Field/Field";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import { CodedErrorAttrs } from "@/library/coded-error";
import { ServerAction } from "@/library/server-action";

import styles from "./Form.module.scss";

export const FormServerFeedbackContext = createContext<FormFeedback>({});

interface FormFeedback {
	_?: Array<Feedback> | undefined;
	[Field: string]: Array<Feedback> | undefined;
}

const extractFeedbackFrom = (error: unknown) => {
	if (
		"code" in (error as CodedErrorAttrs) &&
		"path" in (error as CodedErrorAttrs)
	) {
		return {
			[(error as CodedErrorAttrs).path!.join(".")]: [
				{
					message: (error as CodedErrorAttrs).code,
					type: "negative"
				}
			]
		} satisfies FormFeedback;
	} else if ("code" in (error as Pick<CodedErrorAttrs, "code">)) {
		return {
			_: [
				{
					message: (error as Pick<CodedErrorAttrs, "code">).code,
					type: "negative"
				}
			]
		} satisfies FormFeedback;
	} else if ("issues" in (error as ZodError)) {
		return (error as ZodError).issues.reduce<FormFeedback>(
			(memo, issue) => {
				const pathKey = issue.path.join(".") || "_";

				return {
					...memo,
					[pathKey]: [
						...(memo[pathKey] || []),
						{ message: issue.message, type: "negative" }
					]
				};
			},
			{}
		);
	} else if ("message" in (error as Error)) {
		return {
			_: [{ message: (error as Error).message, type: "negative" }]
		} satisfies FormFeedback;
	} else {
		return {} satisfies FormFeedback;
	}
};

export default forwardRef(function ActionForm(
	{
		action: serverAction,
		children,
		className,
		debug = false,
		form,
		submitLabel,
		submitVariant
	}: {
		action: ServerAction;
		children?:
			| ReactElement<ComponentProps<typeof Field>>
			| Array<ReactElement<ComponentProps<typeof Field>>>;
		className?: string;
		debug?: boolean;
		form?: AnyFormApi;
		submitLabel: ComponentProps<typeof SubmitButton>["label"];
		submitVariant?: ComponentProps<typeof SubmitButton>["variant"];
	},
	ref: Ref<HTMLFormElement>
) {
	const [serverFeedback, setServerFeedback] = useState<FormFeedback>({});

	const feedback = serverFeedback._ ?? [];

	const clientServerAction: ServerAction = async (data) => {
		const reply = await serverAction(data);

		if (reply) {
			setServerFeedback(extractFeedbackFrom(reply));
		}
	};

	return (
		<NextForm
			{...{ ref }}
			action={clientServerAction}
			className={classNames(styles.form, className)}
		>
			<FeedbackList {...{ feedback }} />

			<FormServerFeedbackContext value={serverFeedback}>
				{children}
			</FormServerFeedbackContext>

			<SubmitButton label={submitLabel} variant={submitVariant} />

			{debug ? (
				<Debug
					value={{
						formId: form?.formId ?? "<undefined>",
						defaultValues:
							form?.options.defaultValues ?? "<undefined>",
						feedback
					}}
				/>
			) : null}
		</NextForm>
	);
});
