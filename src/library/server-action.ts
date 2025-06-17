import { zfd } from "zod-form-data";
import { ZodType } from "zod/v4";

export type ServerAction = (formData: FormData) => Promise<unknown>;

export const normalizeFormData = <T>(schema: ZodType<T>, data: FormData) =>
	zfd.formData(schema).safeParseAsync(data);
