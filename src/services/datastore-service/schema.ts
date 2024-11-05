import { z } from "zod";

export const IDENTITY = z.object({
	id: z.string().uuid()
});

export interface Identity extends z.infer<typeof IDENTITY> {}

export const BOOLEAN_NAMED = (name: string) =>
	z.object({
		[name]: z.boolean()
	});

export const VOID = z.object({}).strict();
