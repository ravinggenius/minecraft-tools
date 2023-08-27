import classNames from "classnames";
import { omit } from "rambda";
import { ComponentProps, ReactElement, useState } from "react";
import { ZodError, ZodSchema } from "zod";

import Button from "@/components/Button/Button";
import FeedbackList, { Feedback } from "@/components/FeedbackList/FeedbackList";
import Field from "@/components/Field/Field";
import Pre from "@/components/Pre/Pre";
import { CodedErrorAttrs } from "@/library/_/errors/coded-error";
import normalizeFormData from "@/library/_/normalize-form-data";
import { ServerAction } from "@/library/_/types";

import styles from "./Form.module.css";

export interface FormMeta {
	submitting: boolean;
}

export default function Form({
	action,
	children,
	className,
	debug = false,
	feedback = [],
	meta,
	submitLabel
}: {
	action: (data: FormData) => Promise<unknown>;
	children?: Array<ReactElement<ComponentProps<typeof Field>>>;
	className?: string;
	debug?: boolean;
	feedback?: Array<Feedback>;
	meta: FormMeta;
	submitLabel: string;
}) {
	return (
		<form {...{ action }} className={classNames(styles.form, className)}>
			<FeedbackList {...{ feedback }} />

			{children}

			<Button disabled={meta.submitting} type="submit" variant="primary">
				{submitLabel}
			</Button>

			{debug ? (
				<Pre>{JSON.stringify({ feedback, meta }, null, 2)}</Pre>
			) : null}
		</form>
	);
}

interface FormFeedback {
	_?: Array<Feedback> | undefined;
	[Field: string]: Array<Feedback> | undefined;
}

export const useForm = (serverAction: ServerAction, schema?: ZodSchema) => {
	const [formFeedback, setFormFeedback] = useState<FormFeedback>({});

	const [submitting, setSubmitting] = useState(false);

	const setFeedback = (error: unknown) => {
		if (
			"code" in (error as CodedErrorAttrs) &&
			"path" in (error as CodedErrorAttrs)
		) {
			setFormFeedback({
				[(error as CodedErrorAttrs).path!.join(".")]: [
					{
						message: (error as CodedErrorAttrs).code,
						type: "negative"
					}
				]
			});
		} else if ("code" in (error as Pick<CodedErrorAttrs, "code">)) {
			setFormFeedback({
				_: [
					{
						message: (error as Pick<CodedErrorAttrs, "code">).code,
						type: "negative"
					}
				]
			});
		} else if ("issues" in (error as ZodError)) {
			setFormFeedback(
				(error as ZodError).issues.reduce<FormFeedback>(
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
				)
			);
		} else if ("message" in (error as Error)) {
			setFormFeedback({
				_: [{ message: (error as Error).message, type: "negative" }]
			});
		} else {
			setFormFeedback({});
		}
	};

	const clientServerAction = async (data: FormData) => {
		setSubmitting(true);

		if (schema) {
			try {
				await schema.parseAsync(normalizeFormData(data));
			} catch (error: unknown) {
				setFeedback(error);

				setSubmitting(false);

				return;
			}
		}

		try {
			const reply = await serverAction(data);

			if (reply) {
				setFeedback(reply);
			}
		} finally {
			setSubmitting(false);
		}
	};

	return {
		action: clientServerAction,
		feedback: formFeedback._,
		fieldFeedback: omit(["_"], formFeedback),
		meta: {
			submitting
		} satisfies FormMeta as FormMeta
	};
};
