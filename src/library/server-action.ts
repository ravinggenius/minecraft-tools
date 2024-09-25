import { lensPath, set } from "rambda";
import { ZodSchema } from "zod";

export type ServerAction = (formData: FormData) => Promise<unknown>;

export const normalizeFormData = <T>(schema: ZodSchema<T>, data: FormData) =>
	schema.safeParseAsync(
		[...data.entries()].reduce(
			(memo, [path, value]) => set(lensPath(path), value, memo),
			{}
		)
	);
