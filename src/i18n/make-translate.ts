import pupa from "pupa";
import { CondPair, T, both, cond, equals, hasPath, path } from "rambda";

import { Translation } from "./settings";

export interface MakeTranslateOptions {
	keyPrefix?: string;
}

interface InterpolateOptions {
	context?: string;
	count?: number;
	values?: Record<string, string>;
}

const between = (min: number, max: number) => (n: number) =>
	min <= n && n < max;

const pluralKey = (
	baseKey: string,
	translation: Translation,
	predicate: (count: number) => boolean,
	suffix: string
) =>
	[
		both(predicate, () => hasPath(`${baseKey}_${suffix}`, translation)),
		() => `${baseKey}_${suffix}`
	] satisfies CondPair<[number], string>;

const makeTranslate = (
	translation: Translation,
	{ keyPrefix }: MakeTranslateOptions = {}
) => {
	const t = (
		key: string,
		{ context, count, values = {} }: InterpolateOptions = {}
	) => {
		const baseKey = keyPrefix ? `${keyPrefix}.${key}` : key;

		const withContext = context ? `${baseKey}_${context}` : baseKey;

		const keyWithContextAndCount = Number.isInteger(count)
			? cond([
					pluralKey(withContext, translation, equals(0), "zero"),
					pluralKey(withContext, translation, equals(1), "one"),
					pluralKey(withContext, translation, equals(2), "two"),
					pluralKey(withContext, translation, between(2, 5), "few"),
					pluralKey(
						withContext,
						translation,
						between(5, 8),
						"several"
					),
					pluralKey(
						withContext,
						translation,
						between(8, 100),
						"many"
					),
					pluralKey(withContext, translation, T, "other")
			  ])(count as number)
			: withContext;

		const phrase = path<string>(keyWithContextAndCount, translation);

		return phrase
			? pupa(
					phrase,
					{ context, count, ...values },
					{ ignoreMissing: true }
			  )
			: baseKey;
	};

	return { t };
};

export default makeTranslate;
