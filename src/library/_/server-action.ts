import { lensPath, set } from "rambda";

export type ServerAction = (formData: FormData) => Promise<unknown>;

export const normalizeFormData = (data: FormData): unknown =>
	[...data.entries()].reduce(
		(memo, [path, value]) => set(lensPath(path), value, memo),
		{}
	);
