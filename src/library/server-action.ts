import { lensPath, set } from "rambda";
import { ZodType } from "zod/v4";

export type ServerAction = (formData: FormData) => Promise<unknown>;

export const normalizeFormData = <T>(schema: ZodType<T>, data: FormData) =>
	schema.safeParseAsync(
		[...data.entries()].reduce(
			(memo, [path, value]) => set(lensPath(path), value, memo),
			{}
		)
	);
