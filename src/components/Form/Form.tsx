import classNames from "classnames";
import NextForm from "next/form";
import { omit } from "rambda";
import { ComponentProps, forwardRef, ReactElement, Ref, useState } from "react";
import { ZodError, ZodType } from "zod/v4";

import Debug from "@/components/Debug/Debug";
import FeedbackList, { Feedback } from "@/components/FeedbackList/FeedbackList";
import Field from "@/components/Field/Field";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import { CodedErrorAttrs } from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";

import styles from "./Form.module.scss";

export default forwardRef(function ActionForm(
	{
		action,
		children,
		className,
		debug = false,
		feedback = [],
		submitLabel,
		submitVariant
	}: {
		action: ServerAction;
		children?:
			| ReactElement<ComponentProps<typeof Field>>
			| Array<ReactElement<ComponentProps<typeof Field>>>;
		className?: string;
		debug?: boolean;
		feedback?: Array<Feedback>;
		submitLabel: ComponentProps<typeof SubmitButton>["label"];
		submitVariant?: ComponentProps<typeof SubmitButton>["variant"];
	},
	ref: Ref<HTMLFormElement>
) {
	return (
		<NextForm
			{...{ action, ref }}
			className={classNames(styles.form, className)}
		>
			<FeedbackList {...{ feedback }} />

			{children}

			<SubmitButton label={submitLabel} variant={submitVariant} />

			{debug ? <Debug value={{ feedback }} /> : null}
		</NextForm>
	);
});

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

interface UseFormOptions<T> {
	schema?: ZodType<T>;
}

export const useForm = <T extends unknown>(
	serverAction: ServerAction,
	{ schema }: UseFormOptions<T> = {}
) => {
	const [feedback, setFeedback] = useState<FormFeedback>({});

	const clientServerAction: ServerAction = async (data) => {
		if (schema) {
			const result = await normalizeFormData(schema, data);

			if (!result.success) {
				setFeedback(extractFeedbackFrom(result.error));

				return;
			}
		}

		const reply = await serverAction(data);

		if (reply) {
			setFeedback(extractFeedbackFrom(reply));
		}
	};

	return {
		action: clientServerAction,
		feedback: feedback._,
		fieldFeedback: omit(["_"])(feedback)
	};
};
