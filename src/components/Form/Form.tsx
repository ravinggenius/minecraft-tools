import classNames from "classnames";
import { omit } from "rambda";
import { ComponentProps, forwardRef, ReactElement, Ref, useState } from "react";
import { ZodError, ZodSchema } from "zod";

import FeedbackList, { Feedback } from "@/components/FeedbackList/FeedbackList";
import Field from "@/components/Field/Field";
import Pre from "@/components/Pre/Pre";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import { CodedErrorAttrs } from "@/library/_/errors/coded-error";
import normalizeFormData from "@/library/_/normalize-form-data";
import { ServerAction } from "@/library/_/types";

import styles from "./Form.module.css";

export default forwardRef(function Form(
	{
		action,
		children,
		className,
		debug = false,
		feedback = [],
		submitLabel
	}: {
		action: (data: FormData) => Promise<unknown>;
		children?:
			| ReactElement<ComponentProps<typeof Field>>
			| Array<ReactElement<ComponentProps<typeof Field>>>;
		className?: string;
		debug?: boolean;
		feedback?: Array<Feedback>;
		submitLabel: string;
	},
	ref: Ref<HTMLFormElement>
) {
	return (
		<form
			{...{ action, ref }}
			className={classNames(styles.form, className)}
		>
			<FeedbackList {...{ feedback }} />

			{children}

			<SubmitButton label={submitLabel} />

			{debug ? <Pre>{JSON.stringify({ feedback }, null, 2)}</Pre> : null}
		</form>
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

interface UseFormOptions {
	schema?: ZodSchema;
}

export const useForm = (
	serverAction: ServerAction,
	{ schema }: UseFormOptions = {}
) => {
	const [feedback, setFeedback] = useState<FormFeedback>({});

	const clientServerAction = async (data: FormData) => {
		if (schema) {
			try {
				await schema.parseAsync(normalizeFormData(data));
			} catch (error: unknown) {
				setFeedback(extractFeedbackFrom(error));

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
		fieldFeedback: omit(["_"], feedback)
	};
};
