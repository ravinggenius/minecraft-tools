import { lensPath, set } from "rambda";

const normalizeFormData = (data: FormData): unknown =>
	[...data.entries()].reduce(
		(memo, [path, value]) => set(lensPath(path), value, memo),
		{}
	);

export default normalizeFormData;
