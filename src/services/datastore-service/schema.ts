import { z } from "zod";

export const BOOLEAN_NAMED = (name: string) =>
	z.object({
		[name]: z.boolean()
	});

export const VOID = z.object({}).strict();
