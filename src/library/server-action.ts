import { reform } from "reformdata";
import { ZodType } from "zod/v4";

export type ServerAction = (formData: FormData) => Promise<unknown>;

const replaceEmptyString = (value: unknown) => {
	if (Array.isArray(value)) {
		return value.map<unknown>(replaceEmptyString);
	}

	if (value && typeof value === "object") {
		return Object.entries(value).reduce(
			(memo, [k, v]): Record<string, unknown> => ({
				...memo,
				[k]: replaceEmptyString(v)
			}),
			{}
		);
	}

	return value === "" ? undefined : value;
};

export const normalizeFormData = <T>(schema: ZodType<T>, data: FormData) => {
	const structured = reform(data);
	const options = replaceEmptyString(structured);

	return schema.safeParseAsync(options);
};
